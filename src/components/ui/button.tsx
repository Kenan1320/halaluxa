
import * as React from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-haluna-gradient text-white shadow-md hover:shadow-lg hover:opacity-90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-haluna-gradient underline-offset-4 hover:underline",
        teal: "bg-[#01BFB3] text-white hover:bg-[#01BFB3]/90", // Kept teal variant
        purple: "bg-[#6A3DE8] text-white hover:bg-[#6A3DE8]/90", // Kept purple variant
      },
      size: {
        default: "h-10 px-6 py-2 text-sm",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
  to?: string;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, href, to, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    if (href) {
      return (
        <a
          href={href}
          className={cn(buttonVariants({ variant, size, className }))}
          {...(props as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        />
      );
    }
    
    if (to) {
      return (
        <Link
          to={to}
          className={cn(buttonVariants({ variant, size, className }))}
          {...(props as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        />
      );
    }
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
