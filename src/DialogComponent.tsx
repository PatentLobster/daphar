import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import ReactCodeMirror from "@uiw/react-codemirror";
import { json } from '@codemirror/lang-json';
import {dracula} from "@uiw/codemirror-theme-dracula";

const DialogComponent = ({item}) => {

    let [isOpen, setIsOpen] = useState(false)
    const handleClick = () => {
        console.log(item)
        setIsOpen(true)
    }
    return (
        <div>
            <button onClick={handleClick} >
                Inspect
            </button>
            <Dialog
                    open={isOpen}
                    onClose={() => setIsOpen(false)}
                    className="relative z-50"

            >
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

                {/* Full-screen container to center the panel */}
                <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel
                    className="mx-auto pt-4  rounded bg-white w-full h-full"
                >
                    <Dialog.Title><span className={"p-2"}>{item.request.url}</span></Dialog.Title>
                    <Dialog.Description>

                    </Dialog.Description>
                    <div className={"p-2 pb-0"}>
                        Method: <span
                        className={"inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 mr-4 text-xs font-medium text-green-800"}
                    >
                        {item.request.method}
                    </span>
                        Status: <span
                        className={"inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"}
                    >
                            {item?.response?.status}
                            </span>
                    </div>
                    <div className={"py-2"}>

                        <ReactCodeMirror
                            value={JSON.stringify(item, null, 2)}
                            extensions={[json()]}
                            theme={dracula}
                            maxHeight={"88vh"}
                            editable={false}
                        />
                    </div>
                </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    )
}

export default DialogComponent