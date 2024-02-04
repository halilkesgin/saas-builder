import Image from "next/image"
import Link from "next/link"
import { Check } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { pricingCards } from "@/lib/constants"
import { cn } from "@/lib/utils"

export default function Home() {
    return (
        <>
            <section className="h-full w-full md:pt-44 mt-[-70px] relative flex items-center justify-center flex-col ">
                <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10" />
                <p className="text-center">
                    Run your agency, in one place
                </p>
                <div className="bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text relative">
                    <h1 className="text-9xl font-bold text-center md:text-[300px]">
                        SaaS Builder
                    </h1>
                </div>
                <div className="flex justify-center items-center relative md:mt-[-70px]">
                    <Image
                        src={'/assets/preview.png'}
                        alt="banner image"
                        height={1200}
                        width={1200}
                        className="rounded-tl-2xl rounded-tr-2xl border-2 border-muted"
                    />
                    <div className="bottom-0 top-[50%] bg-gradient-to-t dark:from-background left-0 right-0 absolute z-10">

                    </div>
                </div>
            </section>
            <section className="flex items-center justify-center flex-col gap-4 md:!mt-20 mt-[-40px]">
                <h3 className="text-4xl text-center">
                    Choose what fits you right
                </h3>
                <p className="text-muted-foreground text-center">
                    Our straightforward pricing plans are tailored to meet your needs. If
                    {" you're"} not <br />
                    ready to commit you can get started for free.
                </p>
                <div className="flex justify-center gap-4 flex-wrap mt-6">
                    {pricingCards.map((item) => (
                        <Card
                            key={item.title}
                            className={cn(
                                "w-[300px] flex flex-col justify-between",
                                item.title === "Unlimited Saas" ? "border-2 border-primary" : ""
                            )}
                        >
                            <CardHeader>
                                <CardTitle className={cn(
                                    item.title !== "Unlimited Saas" ? "text-muted-foreground" : ""
                                )}>
                                    {item.title}
                                </CardTitle>
                                <CardDescription>
                                    {item.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <span className="text-4xl font-bold">
                                    {item.price}
                                </span>
                                <span>/m</span>
                            </CardContent>
                            <CardFooter className="flex flex-col items-center gap-4">
                                <div>
                                    {item.features.map((feature) => (
                                        <div
                                            key={feature}
                                            className="flex gap-2 items-center"
                                        >
                                            <Check className="text-muted-foreground" />
                                            <p>{feature}</p>
                                        </div>
                                    ))}
                                </div>
                                <Link
                                    href={`/agency?plan=${item.priceId}`}
                                    className={cn(
                                        "w-full text-center bg-primary p-2 rounded-md",
                                        item.title !== "Unlimited Saas" ? "!bg-muted-foreground" : ""
                                    )}
                                >
                                    Get started
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </section>
        </>
    )
}
