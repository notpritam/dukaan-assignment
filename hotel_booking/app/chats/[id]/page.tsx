"use client";
import Link from "next/link";
import {
  CornerDownLeft,
  MessageSquareMore,
  MessagesSquare,
  Mic,
  Paperclip,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Bell,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useHotelStore } from "@/lib/store/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Image from "next/image";

const formSchema = z.object({
  messages: z.string().min(5).max(3000),
});

interface ChatRoom {
  id: number;
  room: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  userId: string;
}

interface Message {
  id: number;
  createdAt: string;
  updatedAt: string;
  roomId: number;
  isBot: boolean;
  userId: string;
  content: string;
}

export default function Page({ params }: { params: { id: string } }) {
  const { logout, user } = useHotelStore();

  const [loading, setLoading] = useState(false);

  const [rooms, setRooms] = useState<ChatRoom[]>([]);

  const [messages, setMessages] = useState<Message[]>([]);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      messages: "",
    },
  });

  const sendMessage = async (message: string) => {
    try {
      const response = await fetch("http://localhost:3001/chat/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token as string,
        },
        body: JSON.stringify({ chatRoomId: params.id, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data?.message === "Failed to authenticate token") {
          logout();
          toast(data.message || "An error occurred, please try again later");
          router.push("/auth/login");
          router.refresh();
          return;
        } else {
          toast(data.message || "An error occurred, please try again later");
          router.refresh();
          return;
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: data.message.id,
          content: data.message.content,
          isBot: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          roomId: Number(params.id),
          userId: user?.token as string,
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
    setLoading(false);
  };

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    sendMessage(values.messages);

    setMessages((prev) => [
      ...prev,
      {
        id: Math.floor(Math.random() * 1000),
        content: values.messages,
        isBot: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        roomId: Number(params.id),
        userId: user?.token as string,
      },
    ]);
    form.reset();
  }

  useEffect(() => {
    let isMounted = true;

    const getChats = async () => {
      try {
        if (isMounted) {
          const response = await fetch("http://localhost:3001/chat", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: user?.token as string,
            },
          });

          const data = await response.json();

          if (!response.ok) {
            if (data?.message === "Failed to authenticate token") {
              logout();
              toast(
                data.message || "An error occurred, please try again later"
              );
              router.push("/auth/login");
              router.refresh();
              return;
            } else {
              toast(
                data.message || "An error occurred, please try again later"
              );
              router.refresh();
              return;
            }
          }
          let room: ChatRoom[] = [];

          data.chatRooms?.forEach((item: ChatRoom) => {
            room.push(item);
          });

          setRooms(room);
        }
      } catch (error: any) {
        toast("An error occurred, please try again later");
      }
    };

    if (isMounted && user?.token) {
      getChats();
    }

    return () => {
      isMounted = false;
    };
  }, [user]);

  useEffect(() => {
    let isMounted = true;

    const fetchMessages = async () => {
      try {
        if (isMounted) {
          const response = await fetch(
            `http://localhost:3001/chat/${params.id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: user?.token as string,
              },
            }
          );
          const data = await response.json();

          if (!response.ok) {
            if (data?.message === "Failed to authenticate token") {
              logout();
              toast(
                data.message || "An error occurred, please try again later"
              );
              router.push("/auth/login");
              router.refresh();
              return;
            } else {
              toast(
                data.message || "An error occurred, please try again later"
              );
              router.refresh();
              return;
            }
          }
          const message: Message[] = data.chatMessages || [];
          setMessages(message);
          console.log("Messages", message);
        }
      } catch (error: any) {
        console.error("Error fetching messages:", error);
        toast("An error occurred, please try again later");
      }
    };

    if (isMounted && user?.token) {
      fetchMessages();
    }
    return () => {
      isMounted = false;
    };
  }, [user]);

  return (
    <div className="grid  relative min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Image src="/logo.png" alt="Acme Inc" width={24} height={24} />
              <span className="">Crestview Hotel</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/chats"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <MessageSquareMore className="h-4 w-4" />
                New Chat Support
              </Link>
              {rooms?.map((room) => (
                <>
                  <Link
                    href={`/chats/${room.id}`}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                      params.id == String(room.id)
                        ? "text-white bg-slate-600"
                        : ""
                    )}
                  >
                    <MessagesSquare className="h-4 w-4" />
                    {room.name}
                    {/* <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                      6
                    </Badge> */}
                  </Link>
                </>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col ">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Package2 className="h-6 w-6" />
                  <span className="sr-only">Acme Inc</span>
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Orders
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    6
                  </Badge>
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Package className="h-5 w-5" />
                  Products
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Users className="h-5 w-5" />
                  Customers
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <LineChart className="h-5 w-5" />
                  Analytics
                </Link>
              </nav>
              <div className="mt-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Upgrade to Pro</CardTitle>
                    <CardDescription>
                      Unlock all features and get unlimited access to our
                      support team.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" className="w-full">
                      Upgrade
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span onClick={logout}>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <div className="flex flex-col h-full gap-4 bg-muted/50 p-4 lg:col-span-2">
          {/* <Badge variant="outline" className="absolute right-3 top-3">
            Output
          </Badge> */}
          <div className="h-[80vh]">
            <div className="h-full">
              <div className="flex  flex-col justify-end h-full overflow-y-scroll hide-scroll gap-2">
                {messages?.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-2 p-3 rounded-lg shadow-md max-w-[50%]",
                      message?.isBot
                        ? "justify-start bg-slate-600 text-white mr-auto"
                        : "bg-slate-400 justify-end ml-auto"
                    )}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {message.isBot ? "Bot" : "You"}
                      </span>
                      <div
                        className="text-sm"
                        dangerouslySetInnerHTML={{ __html: message.content }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Form {...form}>
            <form
              onSubmit={
                loading
                  ? (e) => {
                      e.preventDefault();
                    }
                  : form.handleSubmit(onSubmit)
              }
              className="relative overflow-hidden  rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
              x-chunk="dashboard-03-chunk-1"
            >
              <Label htmlFor="message" className="sr-only">
                Message
              </Label>
              <FormField
                control={form.control}
                name="messages"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        id="message"
                        placeholder="Type your message here..."
                        className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center p-3 pt-0">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Paperclip className="size-4" />
                      <span className="sr-only">Attach file</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Attach File</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Mic className="size-4" />
                      <span className="sr-only">Use Microphone</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Use Microphone</TooltipContent>
                </Tooltip>
                <Button
                  disabled={loading}
                  type="submit"
                  size="sm"
                  className="ml-auto gap-1.5"
                >
                  Send Message
                  <CornerDownLeft className="size-3.5" />
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
