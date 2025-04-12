import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DeleteModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    isLoading?: boolean
    title?: string
}

function DeleteModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    isLoading = false,
    title = "Delete Design" 
}: DeleteModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className={cn(
                "max-w-[400px] gap-6",
                "data-[state=open]:animate-in data-[state=closed]:animate-out",
                "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
                "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
                "data-[state=open]:slide-in-from-left-1/2 data-[state=closed]:slide-out-to-left-1/2",
                "data-[state=open]:slide-in-from-top-[48%] data-[state=closed]:slide-out-to-top-[48%]",
                "border border-border/50 bg-background/95",
                "backdrop-blur-sm"
            )}>
                <DialogHeader className="flex flex-col items-center gap-3 pt-2">
                    <div className={cn(
                        "rounded-full bg-red-100 p-3",
                        "animate-in zoom-in-95 duration-200",
                        "group-hover:bg-red-200 transition-colors"
                    )}>
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="text-center">
                        <DialogTitle className="text-xl">{title}</DialogTitle>
                        <DialogDescription className="mt-2 text-[15px] leading-normal">
                            Are you sure you want to delete this design? This action cannot be undone.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="flex gap-3">
                    <Button 
                        variant="outline" 
                        className={cn(
                            "flex-1 text-[15px]",
                            "transition-all duration-200",
                            "hover:bg-secondary/80"
                        )}
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="destructive" 
                        className={cn(
                            "flex-1 text-[15px]",
                            "transition-all duration-300",
                            "hover:bg-red-600/90",
                            "focus:ring-red-500",
                            isLoading && "animate-pulse"
                        )}
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteModal