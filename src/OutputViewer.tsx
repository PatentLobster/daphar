import {Dialog} from "@headlessui/react";
import ReactCodeMirror from "@uiw/react-codemirror";
import {php} from "@codemirror/lang-php";
import {dracula} from "@uiw/codemirror-theme-dracula";
import {useState} from "react";
import {set} from "lodash";

const OutputViewer = ({output, runTemplate}) => {

    const [isOpen, setIsOpen] = useState(false)

    return (
        <div>
            <button
                type="button"
                onClick={() => {
                    runTemplate()
                    setIsOpen(true)
                }}
                className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mr-1.5"
            >
                Execute template
            </button>
            <Dialog
                open={isOpen}
                onClose={() => setIsOpen(false)}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="mx-auto rounded bg-white w-[95vw] py-4 h-full">
                        <Dialog.Title><span className={"p-4"}>Output: </span></Dialog.Title>
                        <ReactCodeMirror
                            value={output}
                            extensions={[php()]}
                            theme={dracula}
                            height={"88vh"}
                            maxHeight={"88vh"}
                            editable={false}
                        />
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    )
}

export default OutputViewer