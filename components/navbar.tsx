"use client";

import * as React from "react";
import Link from "next/link";

import { UserButton, SignInButton, useUser } from '@clerk/nextjs'

import { MapPin, Menu, Search, X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { isSignedIn } = useUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              Serve Ease
            </span>
          </Link>
          
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link
              href="/"
              className="flex items-center"
              onClick={() => setIsOpen(false)}
            >
              <span className="font-bold">Serve Ease</span>
            </Link>
            <nav className="flex flex-col gap-4 mt-8">
              <Link href="/services" onClick={() => setIsOpen(false)}>
                Services
              </Link>
              <Link href="/how-it-works" onClick={() => setIsOpen(false)}>
                How it Works
              </Link>
              <Link href="/about" onClick={() => setIsOpen(false)}>
                About
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                className="pl-8 md:w-[300px] lg:w-[400px]"
              />
            </div>
          </div>
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <MapPin className="mr-2 h-4 w-4" />
              Location
            </Button>
            <Link href="/checkout">
              <Button variant="ghost" className="relative">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
            {/* <div id="otpless" className="z-50" data-type="SIDE_CURTAIN">
              <Button>SignIn</Button>
</div> */}

{isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                  Sign In
                </button>
              </SignInButton>
            )}
            
          </nav>
        </div>
      </div>
    </header>
  );
}