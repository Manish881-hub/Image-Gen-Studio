import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, FileQuestion, ExternalLink } from 'lucide-react';

export function HelpSupport() {
    const faqs = [
        {
            question: "How do I generate an image?",
            answer: "Go to the Studio tab, type a creative prompt in the text box (e.g., 'A futuristic city'), and click 'Generate Dream'. You can also use 'Surprise Me' for random ideas."
        },
        {
            question: "Is this service free?",
            answer: "Yes, currently we use open-source models (Pollinations.ai) which are free to use for personal generation."
        },
        {
            question: "How do I save images?",
            answer: "Your generated images are automatically saved to your History. You can also download them by hovering over the image in the History sidebar and clicking the Download icon."
        },
        {
            question: "What is a Negative Prompt?",
            answer: "A Negative Prompt tells the AI what NOT to include in the image. For example, if you see 'blurry' or 'distorted' results, you can add those words to the Negative Prompt."
        }
    ];

    return (
        <div className="flex flex-col items-center justify-start p-8 space-y-8 h-full animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto">

            <div className="w-full max-w-4xl space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
                    <p className="text-muted-foreground">Find answers to common questions or get in touch with our team.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Contact Card */}
                    <Card className="bg-card/50 backdrop-blur border-white/10 md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="w-5 h-5 text-accent-primary" />
                                Contact Support
                            </CardTitle>
                            <CardDescription>
                                Need help with your account or found a bug?
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 border rounded-lg border-white/5 bg-background/30">
                                <div className="space-y-1">
                                    <p className="font-medium">Email Us</p>
                                    <p className="text-sm text-muted-foreground">support@aetherstudio.com</p>
                                </div>
                                <Button onClick={() => window.open('mailto:support@aetherstudio.com')}>
                                    Send Email
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* FAQ Section */}
                    <div className="md:col-span-2 space-y-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <FileQuestion className="w-5 h-5" />
                            Frequently Asked Questions
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            {faqs.map((faq, index) => (
                                <Card key={index} className="bg-card/50 backdrop-blur border-white/10">
                                    <CardHeader>
                                        <CardTitle className="text-base">{faq.question}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Resources */}
                    <Card className="bg-card/50 backdrop-blur border-white/10 md:col-span-2">
                        <CardHeader>
                            <CardTitle>Additional Resources</CardTitle>
                        </CardHeader>
                        <CardContent className="flex gap-4">
                            <Button variant="outline" className="gap-2" onClick={() => window.open('https://github.com', '_blank')}>
                                <ExternalLink size={16} /> Documentation
                            </Button>
                            <Button variant="outline" className="gap-2" onClick={() => window.open('https://discord.com', '_blank')}>
                                <MessageCircle size={16} /> Community Discord
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
