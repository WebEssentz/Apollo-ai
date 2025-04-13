"use client"
import { useAuthContext } from '@/app/provider'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import DesignCard from './_components/DesignCard';
import { RECORD } from '@/app/view-code/[uid]/page';
import { Toaster } from '@/components/ui/sonner';
import { LayoutGrid, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function DesignCardSkeleton() {
    return (        <div className="group relative flex flex-col overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-800 animate-pulse" />
            <div className="flex flex-1 flex-col p-6">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="mt-6 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-1">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                    </div>
                    <Skeleton className="h-9 w-full" />
                </div>
            </div>
        </div>
    );
}

function Designs() {
    const { user } = useAuthContext();
    const [wireframeList, setWireframeList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        user && GetAllUserWireframe();
    }, [user])

    const GetAllUserWireframe = async () => {
        try {
            setIsLoading(true);
            const result = await axios.get('/api/wireframe-to-code?email=' + user?.email);
            setWireframeList(result.data);
        } catch (error) {
            console.error('Error fetching designs:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleDelete = () => {
        GetAllUserWireframe();
    };

    const designCount = wireframeList.length;
    const titleText = designCount === 1 ? "Design" : "Designs";

    return (
        <div className="min-h-screen bg-background px-4 pb-20 pt-8 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
            <Toaster />
            <div className="mx-auto w-full max-w-[100rem]">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight">
                            {isLoading ? (
                                <Skeleton className="h-9 w-32" />
                            ) : (
                                `Your ${titleText}`
                            )}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {isLoading ? (
                                <Skeleton className="h-5 w-64" />
                            ) : (
                                `Manage and explore your wireframe ${titleText.toLowerCase()}`
                            )}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <LayoutGrid className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                            {isLoading ? (
                                <Skeleton className="h-5 w-16 inline-block" />
                            ) : (
                                `${designCount} ${titleText.toLowerCase()}`
                            )}
                        </span>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {isLoading ? (
                        // Show 3 skeleton cards while loading
                        [...Array(3)].map((_, index) => (
                            <DesignCardSkeleton key={index} />
                        ))
                    ) : wireframeList.length > 0 ? (
                        wireframeList.map((item: RECORD, index) => (
                            <DesignCard key={index} item={item} onDelete={handleDelete} />
                        ))
                    ) : (
                        <div className="col-span-full flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed">
                            <LayoutGrid className="h-10 w-10 text-muted-foreground/50" />
                            <h3 className="mt-4 text-lg font-medium">No designs yet</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Create your first design to get started
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Designs