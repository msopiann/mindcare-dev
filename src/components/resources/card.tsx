import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  BookOpen,
  Video,
  Headphones,
  FileText,
  PenToolIcon as Tool,
} from "lucide-react";
import { cn, normalizeImageUrl } from "@/lib/utils";

// Resource type icons mapping
const resourceTypeIcons = {
  ARTICLE: BookOpen,
  VIDEO: Video,
  PODCAST: Headphones,
  GUIDE: FileText,
  TOOL: Tool,
};

const resourceTypeLabels = {
  ARTICLE: "Article",
  VIDEO: "Video",
  PODCAST: "Podcast",
  GUIDE: "Guide",
  TOOL: "Tool",
};

interface ResourceCardProps {
  resource: any; // API resource object
  variant: "primary" | "secondary";
  priority?: boolean;
  className?: string;
}

const variantStyles = {
  primary:
    "bg-[#00373E] dark:bg-[#F9E6D0] text-white dark:text-gray-900 dark:border-amber-200",
  secondary: "bg-[#F9E6D0] dark:bg-white text-gray-900 border-amber-200",
} as const;

const buttonVariantStyles = {
  primary: "bg-[#EFC01D] text-white hover:bg-amber-500",
  secondary: "bg-[#EFC01D] text-white hover:bg-amber-500",
} as const;

export const ResourceCard = memo<ResourceCardProps>(function ResourceCard({
  resource,
  variant,
  priority = false,
  className,
}) {
  const isExternal = resource.link.startsWith("http");
  const Icon =
    resourceTypeIcons[resource.type as keyof typeof resourceTypeIcons];

  return (
    <Card
      className={cn(
        "group mx-auto w-[90%] overflow-hidden rounded-3xl border-0 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg",
        variantStyles[variant],
        className,
      )}
      role="listitem"
    >
      <CardContent className="flex h-full flex-col p-6">
        {/* Resource Image */}
        <div className="relative mb-6 overflow-hidden rounded-2xl">
          <div className="relative aspect-[4/3]">
            <Image
              src={normalizeImageUrl(resource.image)}
              alt={resource.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {/* Featured badge */}
            {resource.highlighted && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-yellow-500 text-yellow-900">
                  <Star className="mr-1 h-3 w-3" />
                  Featured
                </Badge>
              </div>
            )}
            {/* Resource type badge */}
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="flex items-center">
                <Icon className="mr-1 h-3 w-3" />
                {
                  resourceTypeLabels[
                    resource.type as keyof typeof resourceTypeLabels
                  ]
                }
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-grow flex-col space-y-4">
          <div>
            <h3 className="mb-2 text-xl leading-tight opacity-90">
              {resource.title}
            </h3>
            <p className="text-sm font-semibold">{resource.publisher}</p>
            {resource.description && (
              <p className="mt-2 line-clamp-2 text-sm opacity-75">
                {resource.description}
              </p>
            )}
          </div>

          <Button
            asChild
            className={cn(
              "mt-auto w-fit rounded-full font-medium transition-all duration-200",
              buttonVariantStyles[variant],
            )}
            aria-label={`Read more about ${resource.title}`}
          >
            <Link
              href={resource.link}
              {...(isExternal && {
                target: "_blank",
                rel: "noopener noreferrer",
              })}
              className="inline-flex items-center justify-center gap-2"
            >
              Read More
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});
