import { Disclosure, Switch } from "@headlessui/react"

const ItemComponent = ({item, onClick}) => {
    const handleClick = () => {
        onClick(item)
    }
    return <>
        <Disclosure>
            <div className={"mx-auto p-2 flex my-auto w-full justify-center"}>
                <div className={"ml-0"}>
                    <Switch
                        checked={item.selected}
                        onClick={handleClick}
                        className={`${
                            item.selected ? 'bg-blue-600' : 'bg-gray-200'
                        } relative inline-flex h-6 w-11 items-center rounded-full`}
                    >
                        <span className="sr-only">Select Item</span>
                        <span
                            className={`${
                                item.selected ? 'translate-x-6' : 'translate-x-1'
                            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                        />
                    </Switch>
                </div>
                <span className={"rounded-xl p-1 m-2 font-bold bg-amber-800 text-white"}>
                    {item?.request?.method}
                </span>
                - <span className={"rounded-xl p-2 m-2  bg-gray-500/10 "}>{item?.request?.url}</span>
                <Disclosure.Button className="px-3 py-1  rounded-[100%] bg-gray-100">
                    ▽
                </Disclosure.Button>
            </div>

          <Disclosure.Panel className="text-gray-500 mx-auto bg-gray-300 p-8 mb-6">
              {item.request?.postData?.text}
          </Disclosure.Panel>
        </Disclosure>
    </>
}

export default ItemComponent