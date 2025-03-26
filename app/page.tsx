import Chat from "@/components/Chat";

export default function Home() {
    return (
        <main className="container mx-auto p-4 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <header className="border-b pb-4 mb-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-serif">
                            Wikipedia Assistant
                        </h1>
                        <div className="text-sm text-muted-foreground">
                            The Free Encyclopedia
                        </div>
                    </div>
                </header>
                <Chat />
            </div>
        </main>
    );
}
