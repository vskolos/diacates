import { type FormEvent, useState } from 'react'

import type { NextPage } from 'next'
import { api } from '@/utils/api'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Header } from '@/partials'
import { toast } from 'react-hot-toast'
import { formatDate } from '@/utils'

const EditEntry: NextPage = () => {
  const router = useRouter()
  const id = router.query.id as string

  const [date, setDate] = useState('')
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('morning')
  const [glucoseAmount, setGlucoseAmount] = useState('')
  const [insulinDosage, setInsulinDosage] = useState('')
  const [weight, setWeight] = useState('')

  api.data.getById.useQuery(id, {
    onSuccess: (data) => {
      if (!data) return id !== 'new' && void router.push('/new')

      setDate(formatDate(data.date))
      setTimePeriod(data.timePeriod as TimePeriod)
      setGlucoseAmount(`${data.glucoseAmount}`)
      setInsulinDosage(`${data.insulinDosage ?? ''}`)
      setWeight(`${data.weight ?? ''}`)
    },
    onError: (error) => toast.error(error.message),
    enabled: id !== undefined,
  })

  const { mutate: addDataEntry } = api.data.add.useMutation({
    onSuccess: () => router.push('/'),
    onError: (error) => toast.error(error.message),
  })

  const { mutate: editDataEntry } = api.data.edit.useMutation({
    onSuccess: () => router.push('/'),
    onError: (error) => toast.error(error.message),
  })

  const { mutate: removeDataEntry } = api.data.remove.useMutation({
    onSuccess: () => router.push('/'),
    onError: (error) => toast.error(error.message),
  })

  function handleEditDataEntry(e: FormEvent) {
    e.preventDefault()
    if (!date || !timePeriod || !glucoseAmount) return

    const input = {
      id,
      date: new Date(date),
      timePeriod,
      glucoseAmount: Number(glucoseAmount),
      insulinDosage: insulinDosage ? Number(insulinDosage) : null,
      weight: weight ? Number(weight) : null,
    }

    id === 'new' ? addDataEntry(input) : editDataEntry(input)
  }

  return (
    <>
      <Head>
        <title>{id === 'new' ? '????????????????' : '??????????????????????????'} ??????????</title>
        <meta name="description" content="???????????????????????????? ???????????? ??????????????" />
      </Head>
      <Header />
      <main className="grid gap-2">
        <div className="grid overflow-hidden rounded-xl">
          <h1 className="bg-zinc-700 px-6 py-4 text-xl font-semibold text-zinc-100">
            {id === 'new' ? '????????????????' : '??????????????????????????'} ??????????
          </h1>
          <form className="grid bg-zinc-600" onSubmit={handleEditDataEntry}>
            <label className="grid grid-cols-4 items-center gap-8 px-6 py-3.5 even:bg-zinc-700">
              <span className="text-lg font-medium text-zinc-100">????????</span>
              <input
                className="col-span-3 border border-transparent border-b-zinc-500 bg-transparent text-lg text-zinc-200 placeholder:text-zinc-500 focus-visible:border-b-zinc-300 focus-visible:outline-none"
                type="date"
                placeholder="????.????.????????"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
            <label className="grid grid-cols-4 items-center gap-8 px-6 py-3.5 even:bg-zinc-700">
              <span className="text-lg font-medium text-zinc-100">????????????</span>
              <select
                className="col-span-3 border border-transparent border-b-zinc-500 bg-transparent text-lg text-zinc-200 placeholder:text-zinc-500 focus-visible:border-b-zinc-300 focus-visible:outline-none"
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value as TimePeriod)}
              >
                <option value="morning">????????</option>
                <option value="midday">????????</option>
                <option value="evening">??????????</option>
              </select>
            </label>
            <label className="grid grid-cols-4 items-center gap-8 px-6 py-3.5 even:bg-zinc-700">
              <span className="text-lg font-medium text-zinc-100">??????????????</span>
              <input
                className="col-span-3 border border-transparent border-b-zinc-500 bg-transparent text-lg text-zinc-200 placeholder:text-zinc-500 focus-visible:border-b-zinc-300 focus-visible:outline-none"
                type="text"
                inputMode="decimal"
                placeholder="16.5"
                value={glucoseAmount}
                onChange={(e) =>
                  setGlucoseAmount(
                    e.target.value
                      .replaceAll(',', '.')
                      .replaceAll(/[^0-9\.]/g, '')
                  )
                }
              />
            </label>
            <label className="grid grid-cols-4 items-center gap-8 px-6 py-3.5 even:bg-zinc-700">
              <span className="text-lg font-medium text-zinc-100">??????????????</span>
              <input
                className="col-span-3 border border-transparent border-b-zinc-500 bg-transparent text-lg text-zinc-200 placeholder:text-zinc-500 focus-visible:border-b-zinc-300 focus-visible:outline-none"
                type="text"
                inputMode="decimal"
                placeholder="2.5"
                value={insulinDosage}
                onChange={(e) =>
                  setInsulinDosage(
                    e.target.value
                      .replaceAll(',', '.')
                      .replaceAll(/[^0-9\.]/g, '')
                  )
                }
              />
            </label>
            <label className="grid grid-cols-4 items-center gap-8 px-6 py-3.5 even:bg-zinc-700">
              <span className="text-lg font-medium text-zinc-100">??????</span>
              <input
                className="col-span-3 border border-transparent border-b-zinc-500 bg-transparent text-lg text-zinc-200 placeholder:text-zinc-500 focus-visible:border-b-zinc-300 focus-visible:outline-none"
                type="text"
                inputMode="decimal"
                placeholder="3.5"
                value={weight}
                onChange={(e) =>
                  setWeight(
                    e.target.value
                      .replaceAll(',', '.')
                      .replaceAll(/[^0-9\.]/g, '')
                  )
                }
              />
            </label>
            <button
              className="col-span-full bg-green-600 p-4 text-xl font-medium text-white hover:bg-green-700 focus-visible:bg-green-700 active:bg-green-600 disabled:pointer-events-none disabled:opacity-75"
              type="submit"
              disabled={!date || !glucoseAmount}
            >
              ??????????????????
            </button>
          </form>
        </div>
        {id !== 'new' && (
          <button
            className="justify-self-center border-b border-red-600 text-red-600 hover:border-red-500 hover:text-red-500 focus-visible:border-red-500 focus-visible:text-red-500 active:border-red-600 active:text-red-600"
            onClick={() => removeDataEntry(id)}
          >
            ??????????????
          </button>
        )}
      </main>
    </>
  )
}

export default EditEntry
