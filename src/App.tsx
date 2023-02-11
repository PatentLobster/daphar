import { invoke } from "@tauri-apps/api/tauri";
import {useEffect, useState} from "react";
import {template} from "lodash"
import ListComponent from "./ListComponent";
import { listen } from '@tauri-apps/api/event'
import { open } from '@tauri-apps/api/dialog';
import * as he from 'he'

function App() {
    const [data, setData]                   = useState([])
    const [selectedItems, setSelectedItems] = useState([]);
    const [code, setCode]                   = useState(`<% _.forEach(items, function(items) { %>
    $this->body->push(
        ['method' => <%- items.request.method %>,
         'path' => <%- new URL(items.request.url).pathname %>,
         'payload' => <%- JSON.stringify(JSON.parse(items.request?.postData.text), null, \t) %>
        ]);
    <% }); %>`)
    const [output, setOutput]               = useState("")

    const runTemplate = () => {
        const t = template(code)
        setOutput(he.decode(t({items: selectedItems})))
    }

    useEffect(() => {
        listen('tauri://file-drop', event => {
            readHarFromFile(event.payload[0])
        })
        //  tauri://file-drop-hover
    }, [])

    function readHarFromFile(path: string) {
        invoke("parse_har", {path}).then(res => {
            if (typeof res === "string") {
                setData(JSON.parse(res).log.entries.map(item => {
                    return {...item, selected: false}
                }))
            }
        })
    }

    const handleFileUpload = async () => {
            open().then(res => typeof res === "string" ? readHarFromFile(res) : "")
    }

    const handleItemClick = item => {
        const updatedData = data.map(dataItem => {

            if (dataItem === item) {
                return { ...dataItem, selected: !dataItem.selected };
            }
            return dataItem;
        });
        setData(updatedData);
        setSelectedItems(
            updatedData.filter(dataItem => dataItem.selected)
        );
    };



    return (
        <div className="flex flex-col h-screen w-full m-4 mx-auto">
            {data.length > 0 ? <div className="flex flex-col items-center mx-auto p-2 w-screen">
                    <div className={"w-full mx-4"}>
                        <ListComponent
                            items={data}
                            handleItemClick={handleItemClick}
                            setSelectedItems={setSelectedItems}
                            selectedItems={selectedItems}
                            runTemplate={runTemplate}
                            output={output}
                            code={code}
                            setCode={setCode}
                        />
                    </div>
                </div> :
                <div className={"flex justify-center m-auto h-full"}>
                    <div className="my-auto justify-self-center flex justify-center rounded-md <border>-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                        <div className="space-y-1 text-center">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                                aria-hidden="true"
                            >
                                <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                                <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                                >
                                    <span>Upload a file</span>
                                    <input
                                        id="file-upload"
                                        name="file-upload"
                                        type="button"
                                        className="sr-only"
                                        onClick={handleFileUpload}

                                    />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">.HAR only</p>
                        </div>
                    </div>
                </div> }
        </div>
    );
}

export default App;
