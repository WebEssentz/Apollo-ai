import React from 'react'
import { RECORD } from '../[uid]/page'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { RefreshCcw } from 'lucide-react'

function SelectionDetail({ record, regenrateCode, isReady }: any) {
    return record && (        
        <div className='p-5 bg-neutral-900 border border-neutral-800 rounded-lg'>
            <h2 className='font-bold my-2 text-neutral-100'>Wireframe</h2>            <Image src={record?.imageUrl} alt='Wireframe' width={300} height={400} priority
                className='rounded-lg object-contain h-[200px] w-full border border-neutral-800 border-dashed p-2 bg-neutral-800'
            />            <h2 className='font-bold mt-4 mb-2 text-neutral-100'>AI Model</h2>
            <Input defaultValue={record?.model} disabled={true} className='bg-neutral-800 border-neutral-700' />

            <h2 className='font-bold mt-4 mb-2 text-neutral-100'>Description</h2>
            <Textarea defaultValue={record?.description} disabled={true}
                className='bg-neutral-800 border-neutral-700 h-[180px]' />

            <Button className='mt-7 w-full' disabled={!isReady} onClick={() => regenrateCode()} > <RefreshCcw /> Regenerate Code</Button>
        </div>
    )
}

export default SelectionDetail