"use client"
import {Editor} from "@/components/editor";
import useSWR from 'swr'
import {useEffect, useState} from "react";
import {Chart} from "@/components/chart";
import LoadingPage from "@/components/loading";


export default function Home() {
    const [_code, setCode] = useState('')
    const fetcher = (url) => fetch(url).then((res) => res.json())
    const {data, isLoading} = useSWR('/api/config', fetcher)


    useEffect(() => {
        if (data && data.data)
            setCode(JSON.stringify(data.data.value, null, 2))
    }, [data])

    if (!data || isLoading) return <LoadingPage/>

    return (
        <main>
            <Chart code={_code}/>
            <Editor
                code={_code}
                onChange={(code) => {
                    setCode(code)
                }}
            />
        </main>
    )
}
