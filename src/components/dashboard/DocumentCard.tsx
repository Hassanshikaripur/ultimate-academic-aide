
import { useState } from "react";
import { Link } from "react-router-dom";
import { MoreHorizontal, Star } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface DocumentCardProps {
  id: string;
  title: string;
  excerpt: string;
  lastModified: string;
  category: string;
  isFavorite?: boolean;
  progress?: number;
}

export function DocumentCard({
  id,
  title,
  excerpt,
  lastModified,
  category,
  isFavorite = false,
  progress,
}: DocumentCardProps) {
  const [favorite, setFavorite] = useState(isFavorite);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorite(!favorite);
  };

  return (
    <Link to={`/document/${id}`} className="block">
      <div className="group relative bg-card hover:bg-accent/50 rounded-lg border p-4 transition-all duration-200 hover:shadow-md">
        {progress !== undefined && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-muted rounded-t-lg overflow-hidden">
            <div 
              className="h-full bg-research-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
        
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-serif text-lg font-medium line-clamp-2">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{excerpt}</p>
          </div>
          
          <div className="flex items-center space-x-1">
            <button 
              className={cn(
                "opacity-0 group-hover:opacity-100 transition-opacity",
                favorite && "opacity-100"
              )}
              onClick={toggleFavorite}
            >
              <Star 
                className={cn(
                  "h-5 w-5",
                  favorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                )} 
              />
            </button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-background rounded"
                  onClick={(e) => e.preventDefault()}
                >
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onClick={(e) => e.stopPropagation()}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
          <span>{category}</span>
          <span>Updated {lastModified}</span>
        </div>
      </div>
    </Link>
  );
}
