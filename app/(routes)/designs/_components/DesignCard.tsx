import { RECORD } from '@/app/view-code/[uid]/page'
import { Button } from '@/components/ui/button'
import { MODEL_DETAILS } from '@/configs/modelConfig'
import { Badge } from "@/components/ui/badge"
import { Code, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { storage } from '@/configs/firebaseConfig'
import { ref, deleteObject } from 'firebase/storage'
import axios from 'axios'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import DeleteModal from './DeleteModal'

function DesignCard({ item, onDelete }: { item: RECORD, onDelete: () => void }) {
    const modelObj = item && MODEL_DETAILS.find((x => x.model === item?.model))
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        try {
            setIsDeleting(true)
            const imageRef = ref(storage, item.imageUrl);
            await deleteObject(imageRef);
            await axios.delete('/api/wireframe-to-code?uid=' + item.uid);
            toast.success('Design deleted successfully');
            onDelete();
        } catch (error) {
            console.error('Error deleting design:', error);
            toast.error('Failed to delete design');
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
            <DeleteModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                isLoading={isDeleting}
            />
            
            <div className={cn(
                "group relative flex flex-col overflow-hidden rounded-xl border bg-card",
                "transition-all duration-300",
                "hover:shadow-xl hover:shadow-primary/5",
                "hover:border-primary/10",
                isDeleting && "opacity-50 pointer-events-none"
            )}>
                {/* Image Container with Hover Delete Button */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                    <Image 
                        src={item?.imageUrl} 
                        alt='Design preview'
                        fill
                        priority
                        className={cn(
                            "object-cover",
                            "transition-all duration-500",
                            "group-hover:scale-[1.02]"
                        )}
                    />
                    <div className={cn(
                        "absolute inset-0",
                        "bg-gradient-to-t from-black/20 via-black/5 to-transparent",
                        "opacity-0 transition-opacity duration-300",
                        "group-hover:opacity-100"
                    )} />
                    
                    {/* Delete Button */}
                    <Button
                        variant="destructive"
                        size="icon"
                        className={cn(
                            "absolute right-3 top-3 h-8 w-8",
                            "opacity-0 scale-90",
                            "transition-all duration-300",
                            "group-hover:opacity-100 group-hover:scale-100",
                            "hover:scale-110 hover:bg-red-600",
                            "focus:opacity-100 focus:scale-100",
                            "z-10"
                        )}
                        onClick={() => setIsDeleteModalOpen(true)}
                    >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete design</span>
                    </Button>
                </div>

                {/* Content Container */}
                <div className="flex flex-1 flex-col p-6">
                    {/* Description */}
                    <p className="mb-6 line-clamp-2 flex-grow text-sm text-muted-foreground">
                        {item?.description}
                    </p>

                    {/* Footer Section */}
                    <div className="flex flex-col gap-4">
                        {/* Model Info */}
                        {modelObj && (
                            <div className="flex items-center gap-3 group/model">
                                <div className={cn(
                                    "relative h-10 w-10 overflow-hidden rounded-full",
                                    "bg-gray-50 p-1.5",
                                    "ring-1 ring-gray-200/50",
                                    "transition-transform duration-300",
                                    "group-hover/model:scale-105"
                                )}>
                                    <Image 
                                        src={modelObj.icon} 
                                        alt={modelObj.name}
                                        fill
                                        className="object-contain p-1"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-medium text-foreground">
                                        {modelObj.name}
                                    </span>
                                    <Badge 
                                        variant={modelObj.badge === 'Premium' ? 'secondary' : 'outline'}
                                        className="w-fit px-2 py-0.5 text-xs"
                                    >
                                        {modelObj.badge}
                                    </Badge>
                                </div>
                            </div>
                        )}

                        {/* View Code Button - Full Width */}
                        <Link href={'/view-code/' + item?.uid} className="w-full">
                            <Button 
                                variant="default" 
                                className={cn(
                                    "w-full",
                                    "transition-all duration-300",
                                    "hover:scale-[1.02] active:scale-[0.98]"
                                )}
                            >
                                <Code className="mr-2 h-4 w-4" />
                                View Code
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DesignCard