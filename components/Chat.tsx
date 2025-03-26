"use client";

import { useChat } from "ai/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, RefreshCw, StopCircle, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";

interface Source {
    type: "source";
    source: {
        sourceType: "url";
        id: string;
        url: string;
    };
}

function formatCitations(text: string, sources: Source[]) {
    if (typeof text !== "string") return text;

    const parts = text.split(/(\[\d+\])/);
    return parts.map((part, index) => {
        const match = part.match(/\[(\d+)\]/);
        if (match) {
            const sourceIndex = parseInt(match[1]) - 1;
            const source = sources[sourceIndex];
            if (source) {
                return (
                    <a
                        key={index}
                        href={source.source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Badge
                            variant="secondary"
                            className="px-1.5 py-0.5 mx-1"
                        >
                            {match[1]}
                        </Badge>
                    </a>
                );
            }
        }
        return part;
    });
}

function formatMessageContent(content: string, sources: Source[]) {
    if (!sources.length) {
        return <ReactMarkdown>{content}</ReactMarkdown>;
    }

    return (
        <ReactMarkdown
            components={{
                ul: ({ children }) => (
                    <ul className="list-disc pl-5 py-1">{children}</ul>
                ),
                ol: ({ children }) => (
                    <ol className="list-decimal pl-5 py-1">{children}</ol>
                ),
                li: ({ children }) => (
                    <li className="mb-1">
                        {formatCitations(children as string, sources)}
                    </li>
                ),
                p: ({ children }) => (
                    <div className="py-1">
                        {formatCitations(children as string, sources)}
                    </div>
                ),
            }}
        >
            {content}
        </ReactMarkdown>
    );
}

export default function Chat() {
    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        isLoading,
        setMessages,
        setInput,
        stop,
        reload,
    } = useChat({
        api: "/api/chat",
    });

    const handleNewChat = () => {
        setMessages([]); // clear all messages
        setInput(""); // clear input
    };

    return (
        <Card className="w-full max-w-4xl mx-auto flex flex-col h-[80vh] border rounded shadow-sm">
            {/* Wikipedia-style header */}
            <div className="bg-secondary p-3 border-b">
                <h2 className="text-lg font-serif">Interactive Assistant</h2>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={cn(
                            "mb-4 flex flex-col",
                            message.role === "user"
                                ? "items-end"
                                : "items-start"
                        )}
                    >
                        <div
                            className={cn(
                                "px-4 py-3 max-w-[85%] rounded",
                                message.role === "user"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary border"
                            )}
                        >
                            {message.role === "assistant" &&
                            message.parts?.some(
                                (part) => part.type === "source"
                            )
                                ? formatMessageContent(
                                      message.content,
                                      message.parts.filter(
                                          (part): part is Source =>
                                              part.type === "source"
                                      )
                                  )
                                : message.content}
                        </div>
                        {/* Sources section */}
                        {message.role === "assistant" &&
                            message.parts?.some(
                                (part) => part.type === "source"
                            ) && (
                                <div className="mt-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1 mb-2">
                                        <span>References:</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 ml-4">
                                        {message.parts
                                            .filter(
                                                (part): part is Source =>
                                                    part.type === "source"
                                            )
                                            .map((part, index) => {
                                                // Extract domain from URL
                                                const domain = new URL(
                                                    part.source.url
                                                ).hostname.replace("www.", "");
                                                return (
                                                    <a
                                                        key={part.source.id}
                                                        href={part.source.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary hover:underline"
                                                    >
                                                        <Badge
                                                            variant="outline"
                                                            className="font-serif"
                                                        >
                                                            <LinkIcon className="h-3 w-3 mr-1" />
                                                            {`[${
                                                                index + 1
                                                            }] ${domain}`}
                                                        </Badge>
                                                    </a>
                                                );
                                            })}
                                    </div>
                                </div>
                            )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                )}
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t bg-muted">
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                    <Textarea
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask Wikipedia..."
                        className="min-h-[40px] max-h-[120px] h-[40px] border-secondary"
                    />
                    <div className="flex gap-2">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="font-serif"
                        >
                            Search
                        </Button>
                        {isLoading ? (
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={stop}
                                className="font-serif"
                            >
                                <StopCircle className="h-4 w-4 mr-2" />
                                Stop
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={(e) => {
                                    e.preventDefault();
                                    reload();
                                }}
                                disabled={messages.length === 0}
                                className="font-serif"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Regenerate
                            </Button>
                        )}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleNewChat}
                            title="Start New Chat"
                            className="font-serif"
                        >
                            New Search
                        </Button>
                    </div>
                </form>
            </div>
        </Card>
    );
}
