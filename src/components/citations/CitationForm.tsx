
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const citationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  authors: z.string().min(1, "Author(s) is required"),
  year: z.string()
    .refine(val => !isNaN(Number(val)), "Year must be a number")
    .refine(val => {
      const year = Number(val);
      return year >= 1800 && year <= new Date().getFullYear();
    }, `Year must be between 1800 and ${new Date().getFullYear()}`),
  journal: z.string().min(1, "Journal/Source is required"),
  doi: z.string().optional(),
  url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  abstract: z.string().optional(),
});

export type CitationFormValues = z.infer<typeof citationSchema>;

interface CitationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CitationFormValues) => void;
  defaultValues?: Partial<CitationFormValues>;
  mode: "add" | "edit";
}

export function CitationForm({ 
  open, 
  onOpenChange, 
  onSubmit,
  defaultValues = {
    title: "",
    authors: "",
    year: new Date().getFullYear().toString(),
    journal: "",
    doi: "",
    url: "",
    abstract: "",
  },
  mode 
}: CitationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<CitationFormValues>({
    resolver: zodResolver(citationSchema),
    defaultValues,
  });

  const handleSubmit = async (data: CitationFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      form.reset();
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add New Citation" : "Edit Citation"}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Paper or book title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="authors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author(s)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Smith, J., Jones, M." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input placeholder="Publication year" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="journal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Journal/Source</FormLabel>
                  <FormControl>
                    <Input placeholder="Journal name or publication source" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="doi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>DOI</FormLabel>
                    <FormControl>
                      <Input placeholder="Digital Object Identifier (optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Web address (optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="abstract"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Abstract</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Paper abstract or description (optional)" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : mode === "add" ? "Add Citation" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
