import {Fragment, useLayoutEffect, useRef, useState} from "react";
import DialogComponent from "./DialogComponent";
import {CheckIcon, ChevronUpDownIcon, MagnifyingGlassIcon} from "@heroicons/react/20/solid";
import OutputViewer from "./OutputViewer";
import Ide from "./Ide";
import { Listbox, Transition } from "@headlessui/react";

function classNames(...classes) {
return classes.filter(Boolean).join(' ')
}

const ListComponent = ({items, handleItemClick, selectedItems, setSelectedItems, runTemplate, output, code, setCode }) => {

    const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD', 'TRACE', 'CONNECT']


    const checkbox = useRef()
    const [checked, setChecked] = useState(false)
    const [indeterminate, setIndeterminate] = useState(false)
    const [filterText, setFilterText]       = useState('');
    const [selected, setSelected] = useState([])

    useLayoutEffect(() => {
        const isIndeterminate = selectedItems.length > 0 && selectedItems.length < items.length
        setChecked(selectedItems.length === items.length)
        setIndeterminate(isIndeterminate)
        // @ts-ignore
        checkbox.current.indeterminate = isIndeterminate
    }, [selectedItems])

    function toggleAll() {
        setSelectedItems(checked || indeterminate ? () => {
            items.map((i => {
                i.selected = false;
                return i;
            }))
            return []
        } : items.map((i => {
            i.selected = true;
            return i;
        })))
        setChecked(!checked && !indeterminate)
        setIndeterminate(false)
    }

    const filteredData = items.filter(item =>
        selected.length > 0 ? selected.includes(item.request.method) &&  item.request.url.includes(filterText) : item.request.url.includes(filterText)
    );

    const handleFilterChange = event => {
        setFilterText(event.target.value);
    };


    return (
      <div className="my-2 flex flex-col mx-auto w-[95vw] justify-center ">
        <div className="-my-2 ">
          <div className="inline-flex py-2 align-middle w-full">
            <div className="relative text-ellipsis py-2      shadow ring-1 ring-black ring-opacity-5 h-full w-full  rounded-lg">
              <div className="relative top-0 space-y-2 flex h-12  items-center space-x-3 bg-gray-50 w-full flex flex-row justify-start">
                  <div className="ml-4 mr-auto">
                      <div className="max-w-lg lg:max-w-xs">
                          <label htmlFor="search" className="sr-only">
                              Search
                          </label>
                          <div className="relative">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                              </div>
                              <input
                                  id="search"
                                  name="search"
                                  className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 leading-5 placeholder-gray-500 shadow-sm focus:border-blue-600 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-600 sm:text-sm"
                                  placeholder="Filter URI"
                                  type="search"
                                  value={filterText}
                                  onChange={handleFilterChange}
                              />
                          </div>
                      </div>
                  </div>

                  <Listbox value={selected} onChange={setSelected} multiple>
                      {({ open }) => (
                          <>
                              <Listbox.Label className="block text-sm font-medium text-gray-700"></Listbox.Label>
                              <div className="relative mt-1">
                                  <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                                      <span className="block truncate">{selected.length > 0 ? selected.map(item => (
                                          <span className={"inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"}>{item}</span>
                                      )) : 'Filter'}</span>
                                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
                                  </Listbox.Button>

                                  <Transition
                                      show={open}
                                      as={Fragment}
                                      leave="transition ease-in duration-100"
                                      leaveFrom="opacity-100"
                                      leaveTo="opacity-0"
                                  >
                                      <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm ">
                                          {methods.map((method) => (
                                              <Listbox.Option
                                                  key={method}
                                                  className={({ active }) =>
                                                      classNames(
                                                          active ? 'text-white bg-indigo-600' : 'text-gray-900',
                                                          'relative cursor-default select-none py-2 pl-3 pr-9'
                                                      )
                                                  }
                                                  value={method}
                                              >
                                                  {({ selected, active }) => (
                                                      <>
                        <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                          {method}
                        </span>

                                                          {selected ? (
                                                              <span
                                                                  className={classNames(
                                                                      active ? 'text-white' : 'text-indigo-600',
                                                                      'absolute inset-y-0 right-0 flex items-center pr-4'
                                                                  )}
                                                              >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                                                          ) : null}
                                                      </>
                                                  )}
                                              </Listbox.Option>
                                          ))}
                                      </Listbox.Options>
                                  </Transition>
                              </div>
                          </>
                      )}
                  </Listbox>

                  <Ide setCode={setCode} code={code} />
                {selectedItems.length > 0 && (
                    <OutputViewer output={output} runTemplate={runTemplate} />


              )}
              </div>
              <table className="table- divide-y divide-gray-300 w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="relative w-12 mx-8 px-2  ">
                      <input
                        type="checkbox"
                        className="relative left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        ref={checkbox}
                        checked={checked}
                        onChange={toggleAll}
                      />
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Method
                    </th>
                      <th scope="col" className=" py-3.5 pr-3 min-w-[40vw] text-left  text-sm font-semibold text-gray-900">
                          URI
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className=" py-3.5 pl-3 pr-4 ">
                      <span className="sr-only">View All</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white text-ellipsis max-w-[95vw] ">
                  {filteredData.map((item, i) => (
                    <tr key={i} className={selectedItems.includes(item) ? 'bg-gray-50' : undefined}>
                      <td className="relative w-12 px-4">
                        {selectedItems.includes(item) && (
                          <div className="relative text-ellipsis inset-y-0 left-0 w-0.5 bg-indigo-600" />
                        )}
                        <input
                          type="checkbox"
                          className="relative left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                          value={item.email}
                          checked={selectedItems.includes(item)}
                          onChange={(e) =>
                            handleItemClick(item)
                          }
                        />
                      </td>
                        <td className=" px-4 py-4  text-sm text-gray-500">{item.request.method}</td>
                        <td
                        className={classNames(
                          ' py-4 text-ellipsis truncate w-[40vw] max-w-[65vw] overflow-hidden text-sm font-medium',
                          selectedItems.includes(item) ? 'text-indigo-600' : 'text-gray-900'
                        )}
                      >
                          {item?.request?.url}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">{item?.response?.status}</td>
                      <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a href="#" className="text-indigo-600 hover:text-indigo-900">
                           <span className="sr-only">, {item.request.method}</span>
                            <DialogComponent item={item} key={i}/>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  )
}

export default ListComponent