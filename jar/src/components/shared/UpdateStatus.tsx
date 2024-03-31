import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import { StatusValidation } from "@/lib/validation"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Models } from "appwrite"
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { useGetCustomMedia, useUpdateStatus } from "@/lib/react-query/queriesAndMutations";
import { Button } from "@/components/ui/button"
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";
//for emojis
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
  import {Tabs, Tab} from "@nextui-org/tabs";
import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/card";
import {ScrollShadow} from "@nextui-org/scroll-shadow";
import { useState } from "react";
import Loader from "./Loader";



type StatusFormProps = {
    status?: Models.Document;
} 
  
const UpdateStatus = ({ status }:StatusFormProps) => {

    const { mutateAsync: updateStatus, isPending: isLoadingUpdate } = useUpdateStatus();
    const { data } = useGetCustomMedia();
    const { user } = useUserContext();
    const { toast } = useToast();
    let [selectedButton, setSelectedButton] = useState<number | null>(null);

    var emoji_selection: any = null;

    const form = useForm<z.infer<typeof StatusValidation>>({
        resolver: zodResolver(StatusValidation),
        defaultValues: {
            Status: status ? status?.Status: "",
            //statusUrl: status ? status?.statusUrl: "https://cloud.appwrite.io/v1/storage/buckets/658aa97dd4b6daf08daa/files/659b9ea07a9a87a7c180/view?project=658a9563226edb8bb50a&mode=admin"
        },
    })

    async function onSelectEmoji(index: number) {
        setSelectedButton(index === selectedButton ? null: index);
        emoji_selection = selectedButton === index ? null : data?.Emoji_Urls[index];
        return emoji_selection
    }
    
    async function onSubmit(values: z.infer<typeof StatusValidation>) {
        //console.log(values)
        const statusUrl = selectedButton !== null ? data?.Emoji_Urls[selectedButton] : null;
        const updatedStatus = await updateStatus({
            userId: user.id,
            ...values,
            statusUrl: statusUrl,
        })
        if(!updatedStatus){
          toast({
            title: 'Please try again'
          })
        }
        window.location.reload()

    }

    
    return (
            <DialogContent className="shad-dialogue sm:max-w-[425px]">
            <DialogHeader >
                <DialogTitle>Update Status</DialogTitle>
                <DialogDescription>
                Make changes to your status here. Click save changes when you're done.
                </DialogDescription>
            </DialogHeader>
            <div>
                <div>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
            <FormField
          control={form.control}
          name="Status"
          render={({ field }) => (
            <FormItem >
              <FormLabel className="shad-form_label">Change Status</FormLabel>
              <FormControl>
              <Input
                  type="text"
                  placeholder="meh"
                  className="shad-input"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message"/>
            </FormItem>
          )}
        />
        <Card className="shad-button_dark_4_add rounded-lg h-52">
        <ScrollShadow>
        {data?.Emoji_Urls.map((imageUrl: string, index: number) => (
            <Button key={index} type="button" variant="outline" onClick={() => onSelectEmoji(index)} className={`${selectedButton === index ? 'bg-primary-500 flex-wrap m-1' : 'shad-emojis rounded-lg flex-wrap m-1'}`} style={{ width: '45px', height: '45px', padding:'0px' }}>
                <img
                src={imageUrl}
                alt={`Emoji ${index + 1}`} className="rounded-md"
                style={{ width: '30px', height: '30px', margin: '0px', padding:'0px', aspectRatio: '1/1'
            }}
              />
          </Button>
        ))}
        </ScrollShadow>
        </Card>
            <DialogFooter>
                <Button type="submit" className="shad-button_primary whitespace-nowrap">{isLoadingUpdate ? (
            <div className="flex-center gap-2">
              <Loader />
            </div>
          ): "Save Changes"}</Button>
            </DialogFooter> 
                </form>
            </Form>
            </div>
            </div>
            </DialogContent>  
    )
    
  }

  export default UpdateStatus