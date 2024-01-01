import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import * as Switch from '@radix-ui/react-switch';
import { Separator } from "@/components/ui/separator"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { useState } from "react"
  
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

const PostForm = () => {
    const [isFormFieldVisible, setIsFormFieldVisible] = useState(false);
    const [isFormFieldVisible_bad, setIsFormFieldVisible_bad] = useState(false);


    const handleButtonClick = () => {
        setIsFormFieldVisible(!isFormFieldVisible); // Toggle the visibility state
    };

    const handleButtonClick_bad = () => {
        setIsFormFieldVisible_bad(!isFormFieldVisible_bad); // Toggle the visibility state
    };
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          username: "",
        },
    })
     
      // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }
    return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
         <FormField
          control={form.control}
          name="Update"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Update</FormLabel>
              <FormControl>
              <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none shad-textarea"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message"/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="Good"
          render={({ field }) => (
            <FormItem className={`${isFormFieldVisible ? '' : 'hidden'}`}>
              <FormLabel className="shad-form_label">Good</FormLabel>
              <FormControl>
              <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none shad-textarea"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage className="shad-form_message"/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="Bad"
          render={({ field }) => (
            <FormItem className={`${isFormFieldVisible_bad ? '' : 'hidden'}`} >
              <FormLabel className="shad-form_label">Bad</FormLabel>
              <FormControl>
              <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none shad-textarea"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message"/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem >
              <FormLabel className="shad-form_label">Add Tags (separated by comma " , ")</FormLabel>
              <FormControl>
              <Input
                  type="text"
                  placeholder="Mood, Frustrated, Angered"
                  className="shad-input"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message"/>
            </FormItem>
          )}
        />
        <div className="flex justify-center items-center mb-20">
        <Dialog>
        <DialogTrigger asChild>
        <Button variant="outline" className="shad-button_dark_4_add w-14 h-14 rounded-full">
            <img src="assets/icons/plus.svg" width={30} alt="add"/>
        </Button>
        </DialogTrigger>
      <DialogContent className="shad-dialogue w-96 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Feelings</DialogTitle>
          <DialogDescription>
          Did the update help you feel good or bad?
          </DialogDescription>
        </DialogHeader>
        <Separator className="shad-button_dark_4_add"/>
        <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4 flex-row shad-button_primary justify-between rounded-lg border p-4">
            <Label htmlFor="Good" className="text-right">Good</Label>
            <Switch.Root checked={isFormFieldVisible ? true : false} onCheckedChange = {handleButtonClick}
        className="w-[42px] h-[25px] justify-self-end col-span-2 shad-switch bg-blackA6 rounded-full flex shadow-[0_2px_10px] shadow-blackA4 focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=checked]:shad-dialogue outline outline-1 cursor-default"
        id="airplane-mode" >
        <Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full shadow-[0_2px_2px] shadow-blackA4 transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
      </Switch.Root>
        </div>
            <div className="grid grid-cols-3 items-center gap-4 flex-row shad-button_primary justify-between rounded-lg border p-4">
            <Label htmlFor="Bad" className="text-right">Bad</Label>
            <Switch.Root checked={isFormFieldVisible_bad ? true : false} onCheckedChange = {handleButtonClick_bad}
        className="w-[42px] h-[25px] justify-self-end col-span-2 mt-2 shad-switch bg-blackA6 rounded-full relative shadow-[0_2px_10px] shadow-blackA4 focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=checked]:shad-dialogue outline cursor-default"
        id="airplane-mode" >
        <Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full shadow-[0_2px_2px] shadow-blackA4 transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
      </Switch.Root>
            </div>
          </div>
      </DialogContent>
    </Dialog>
    </div>
    <div className="flex gap-4 items-center justify-end mt-20">
        <Button type="button" className="shad-button_dark_4">Cancel</Button>
        <Button type="submit" className="shad-button_primary whitespace-nowrap">Submit</Button>
    </div>

      </form>
    </Form>
    )
}

export default PostForm