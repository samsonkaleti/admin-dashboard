'use client'

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, LogOut, Settings, User } from "lucide-react";

export function UserNav() {
  return (
    <div className="flex items-center gap-6 ">
      <Button
        variant="ghost"
        size="icon"
        className="relative text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800" />
        <span className="sr-only">Notifications</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-8 w-8 rounded-full ring-2 ring-gray-200 dark:ring-gray-600 hover:ring-gray-300 dark:hover:ring-gray-500"
          >
            <Avatar className="h-7 w-7">
              <AvatarImage src="/avatars/01.png" alt="@johndoe" />
              <AvatarFallback className="bg-blue-500 text-white text-sm">
                JD
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-64 mt-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
          align="end"
          forceMount
        >
          <DropdownMenuLabel className="font-normal p-2">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                John Doe
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                john.doe@example.com
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="my-2 bg-gray-200 dark:bg-gray-700" />
          <DropdownMenuGroup>
            <DropdownMenuItem className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
              <User className="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-200">Profile</span>
              <DropdownMenuShortcut className="text-xs text-gray-500">
                ⇧⌘P
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
              <Settings className="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-200">Settings</span>
              <DropdownMenuShortcut className="text-xs text-gray-500">
                ⌘S
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="my-2 bg-gray-200 dark:bg-gray-700" />
          <DropdownMenuItem className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900">
            <LogOut className="mr-3 h-4 w-4 text-red-500" />
            <span className="text-red-600 dark:text-red-400">Log out</span>
            <DropdownMenuShortcut className="text-xs text-gray-500">
              ⇧⌘Q
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
