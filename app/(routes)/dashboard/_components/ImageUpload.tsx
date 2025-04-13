"use client"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CloudUpload, Loader2Icon, WandSparkles, X } from 'lucide-react'
import Image from 'next/image'
//@ts-ignore
import uuid4 from "uuid4";
import React, { ChangeEvent, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '@/configs/firebaseConfig'
import axios from 'axios'
import { uuid } from 'drizzle-orm/pg-core'
import { useAuthContext } from '@/app/provider'
import { useRouter } from 'next/navigation'
import Constants from '@/data/Constants'
import { toast } from 'sonner'
import { MODEL_DETAILS } from '@/configs/modelConfig'

function ImageUpload() {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [file, setFile] = useState<File>();
    const [base64Image, setBase64Image] = useState<string>();
    const [model, setModel] = useState<string>();
    const [description, setDescription] = useState<string>();
    const { user } = useAuthContext();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
        });
    };

    const OnImageSelect = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files[0]) {
            const selectedFile = files[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setBase64Image(await convertToBase64(selectedFile));
        }
    }; const OnConverToCodeButtonClick = async () => {
        if (!file || !model || !description) {
            toast("Please fill in all fields");
            return;
        }
        setLoading(true);

        try {
            const uid = uuid4();

            // First process with AI using FormData
            const formData = new FormData();
            formData.append('image', file);
            formData.append('model', model);
            formData.append('description', description);

            // Process with AI first
            const aiResponse = await axios.post('/api/ai-process', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (aiResponse.data?.error) {
                toast('Error processing with AI: ' + aiResponse.data.error);
                return;
            }

            // Then upload to Firebase
            const fileName = Date.now() + '.png';
            const imageRef = ref(storage, "Wireframe_To_Code/" + fileName);
            await uploadBytes(imageRef, file);
            const imageUrl = await getDownloadURL(imageRef);

            // Finally save to database and validate credits
            const dbResult = await axios.post('/api/wireframe-to-code', {
                uid,
                description,
                imageUrl,
                model,
                email: user?.email
            });

            if (dbResult.data?.error) {
                if (dbResult.data.error === 'Not enough credits') {
                    toast('Not Enough Credits!');
                } else {
                    toast(dbResult.data.error || 'Error processing image');
                } return;
            }

            router.push('/view-code/' + uid);
        } catch (error) {
            console.error('Error processing image:', error);
            toast('Error processing image. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    console.log(model)

    return (
        <div className='mt-10'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                {!previewUrl ? <div className='p-7 border border-dashed rounded-md shadow-md
                flex flex-col items-center justify-center
                '>
                    <CloudUpload className='h-10 w-10 text-primary' />
                    <h2 className='font-bold text-lg text-neutral-100'>Upload Image</h2>

                    <p className='text-neutral-400 mt-2'>Click Button Select Wireframe Image </p>
                    <div className='p-5 border border-dashed w-full flex mt-4 justify-center'>
                        <label htmlFor='imageSelect'>
                            <h2 className='p-2 bg-blue-100 font-bold text-primary  rounded-md px-5'>Select Image</h2>
                        </label>

                    </div>
                    <input type="file" id='imageSelect'
                        className='hidden'
                        multiple={false}
                        onChange={OnImageSelect}
                    />

                </div> : <div className='p-5 border border-dashed border-neutral-800 bg-neutral-900'>                        <Image src={previewUrl} alt='preview' width={500} height={500} priority
                    className='w-full h-[250px] object-contain bg-neutral-800'
                />
                    <X className='flex ite justify-end w-full cursor-pointer'
                        onClick={() => setPreviewUrl(null)}
                    />

                </div>
                }
                <div className='p-7 border border-neutral-800 shadow-md rounded-lg bg-neutral-900'>
                    <h2 className='font-bold text-lg text-neutral-100'>Select AI Model</h2>
                    <Select onValueChange={(value) => setModel(MODEL_DETAILS.find(m => m.name === value)?.model)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select AI Model" />
                        </SelectTrigger>
                        <SelectContent>
                            {MODEL_DETAILS.map((model, index) => (
                                <SelectItem value={model.name} key={index}>
                                    <div className='flex items-center gap-2'>
                                        <Image src={model.icon} alt={model.name} width={25} height={25} />
                                        <h2>{model.name}</h2>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <h2 className='font-bold text-lg mt-7 text-neutral-100'>Enter Description about your webpage</h2>
                    <Textarea
                        onChange={(event) => setDescription(event?.target.value)}
                        className='mt-3 h-[150px]'
                        placeholder='Write about your web page' />
                </div>
            </div>

            <div className='mt-10 flex items-center justify-center'>
                <Button onClick={OnConverToCodeButtonClick} disabled={loading}>
                    {loading ? <Loader2Icon className=' animate-spin' /> : <WandSparkles />}
                    Convert to Code</Button>
            </div>
        </div>
    )
}

export default ImageUpload