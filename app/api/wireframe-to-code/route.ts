import { db } from "@/configs/db";
import { usersTable, WireframeToCodeTable } from "@/configs/schema";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { description, imageUrl, base64Image, model, uid, email } = await req.json();

    const creditResult = await db.select().from(usersTable)
        .where(eq(usersTable.email, email));

    if (creditResult[0]?.credits && creditResult[0]?.credits > 0) {
        try {
            // Process with AI first
            const aiResponse = await fetch(`${req.nextUrl.origin}/api/ai-process`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ model, description, base64Image }),
            });

            if (!aiResponse.ok) {
                const errorData = await aiResponse.text();
                console.error('AI processing failed:', errorData);
                return NextResponse.json({ 'error': 'AI processing failed', details: errorData }, { status: 500 });
            }

            // Save to database first
            const result = await db.insert(WireframeToCodeTable).values({
                uid: uid.toString(),
                description: description,
                imageUrl: imageUrl,
                model: model,
                createdBy: email
            }).returning({ id: WireframeToCodeTable.id });

            // Update user credits
            await db.update(usersTable).set({
                credits: creditResult[0]?.credits - 1
            }).where(eq(usersTable.email, email));

            // Return success response with the ID
            return NextResponse.json(result);

        } catch (error) {
            console.error('Error in processing:', error);
            return NextResponse.json({ 
                'error': 'Processing failed', 
                details: error instanceof Error ? error.message : 'Unknown error' 
            }, { status: 500 });
        }
    } else {
        return NextResponse.json({ 'error': 'Not enough credits' })
    }
}

export async function GET(req: Request) {
    const reqUrl = req.url;
    const { searchParams } = new URL(reqUrl);
    const uid = searchParams?.get('uid');
    const email = searchParams?.get('email');
    if (uid) {
        const result = await db.select()
            .from(WireframeToCodeTable)
            .where(eq(WireframeToCodeTable.uid, uid));
        return NextResponse.json(result[0]);
    }
    else if (email) {
        const result = await db.select()
            .from(WireframeToCodeTable)
            .where(eq(WireframeToCodeTable.createdBy, email))
            .orderBy(desc(WireframeToCodeTable.id))
            ;
        return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'No Record Found' })

}

export async function PUT(req: NextRequest) {
    const { uid, codeResp } = await req.json();

    const result = await db.update(WireframeToCodeTable)
        .set({
            code: codeResp
        }).where(eq(WireframeToCodeTable.uid, uid))
        .returning({ uid: WireframeToCodeTable.uid })

    return NextResponse.json(result);

}

export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get('uid');

    if (!uid) {
        return NextResponse.json({ error: 'UID is required' }, { status: 400 });
    }

    try {
        await db.delete(WireframeToCodeTable)
            .where(eq(WireframeToCodeTable.uid, uid));
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting record:', error);
        return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 });
    }
}