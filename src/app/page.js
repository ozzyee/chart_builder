"use client"
import {Editor} from "@/components/editor";
import useSWR from 'swr'
import {useEffect, useState} from "react";
import {Chart} from "@/components/chart";
import LoadingPage from "@/components/loading";


export default function Home() {
    const [_code, setCode] = useState('')
    const [_isLoading, setIsLoading] = useState(false)
    const [config, setConfig] = useState(1)
    const [data, setData] = useState(null)
    const fetcher = (url) => fetch(url).then((res) => res.json())
    const {data: _data, isLoading} = useSWR('/api/config?v=1', fetcher)

    useEffect(() => {
        if (_data && _data.data)
            setData(_data)
    }, [_data])


    useEffect(() => {
        if (data && data.data)
            setCode(JSON.stringify(data.data.value, null, 2))
    }, [data])

    if (!data || isLoading || _isLoading) return <LoadingPage/>

    return (
        <main>
            <Chart code={_code}/>
            <Editor
                config={config}
                onConfigChange={async (config) => {
                    setConfig(config)
                    setIsLoading(true)
                    const res = await fetch(`/api/config?v=${config}`)
                    const data = await res.json()
                    setData(data)
                    setIsLoading(false)
                }}
                code={_code}
                onChange={(code) => {
                    setCode(code)
                }}
            />
        </main>
    )
}
