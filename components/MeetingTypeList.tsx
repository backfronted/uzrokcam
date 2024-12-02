"use client"

import React, { useState } from 'react'
import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModal from './MeetingModal'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useToast } from "@/hooks/use-toast"
import { Textarea } from './ui/textarea'
import ReactDatePicker from 'react-datepicker'
import { Input } from './ui/input'

const MeetingTypeList = () => {
    const router = useRouter()
    const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>()
    const { user } = useUser();
    const client = useStreamVideoClient();
    const [values,setValues] = useState({
        dateTime: new Date(),
        description: '',
        link: '',
    })
    const [callDetails,setCallDetails] = useState<Call>()
    const { toast } = useToast()

    const createMeeting = async () => {
        if(!client || !user) return;

        try{
            if(!values.dateTime){
                toast({
                    title: "Пожалуйста, выберите дату и время."
                })
                return
            }
            const id = crypto.randomUUID();
            const call = client.call('default',id)

            if(!call) throw new Error('Не удалось создать звонок');

            const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
            const description = values.description || 'Мгновенная встреча';

            await call.getOrCreate({
                data:{
                    starts_at: startsAt,
                    custom:{
                        description
                    }
                }
            })
            setCallDetails(call)
            if(!values.description){
                router.push(`/meeting/${call.id}`)
            }
            toast({
                title: "Встреча создана."
            })
        }catch(error){
            console.log(error)
            toast({
                title: "Не удалось создать встречу.",
            })
        }
    }

    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
       <HomeCard
            img='/icons/add-meeting.svg'
            title='Новая встреча'
            description="Начать мгновенную встречу"
            handleClick={() => setMeetingState('isInstantMeeting')}
            className='bg-orange-1'
        />

        <HomeCard 
            img='/icons/schedule.svg'
            title='Запланировать встречу'
            description="Запланировать встречу"
            handleClick={() => setMeetingState('isScheduleMeeting')}
            className='bg-blue-1'
        />
        <HomeCard 
            img='/icons/recordings.svg'
            title='Посмотреть записи'
            description="Посмотреть ваши записи"
            handleClick={() => router.push('/recordings')}
            className='bg-purple-1'
        />
        <HomeCard 
            img='/icons/join-meeting.svg'
            title='Присоединиться к встрече'
            description="Через ссылку приглашения"
            handleClick={() => setMeetingState('isJoiningMeeting')}
            className='bg-yellow-1'
        />
        {!callDetails ? (
            <MeetingModal
            isOpen={meetingState === 'isScheduleMeeting'}
            onClose={() => setMeetingState(undefined)}
            title="Создать встречу"
            handleClick={createMeeting}
            >
                <div className='flex flex-col gap-2.5'>
                    <label className='text-base text-normal leading-[22px] text-sky-2'>Добавьте описание</label>
                    <Textarea className='border-none bg-dark-3 focus-visible:right-0 focus-visible:ring-offset-0' onChange={(e) => {
                        setValues({...values, description: e.target.value})
                    }} />
                </div>
                <div className='flex w-full flex-col gap-2.5'>
                    <label className='text-base text-normal leading-[22px] text-sky-2'>Выберите дату и время</label>
                    <ReactDatePicker
                        selected={values.dateTime}
                        onChange={(date) => setValues({...values,dateTime: date!})}
                        showTimeSelect
                        timeFormat='HH:mm'
                        timeIntervals={15}
                        timeCaption='время'
                        dateFormat="MMMM d, yyyy h:mm aa"
                        className='w-full rounded bg-dark-3 p-2 focus:outline-none'
                    />
                </div>
            </MeetingModal>
        ): (
            <MeetingModal
            isOpen={meetingState === 'isScheduleMeeting'}
            onClose={() => setMeetingState(undefined)}
            title="Встреча создана"
            className='text-center'
            handleClick={() => {
                navigator.clipboard.writeText(meetingLink)
                toast({title: "Ссылка скопирована"})
            }}
            image='/icons/checked.svg'
            buttonIcon='/icons/copy.svg'
            buttonText='Копировать ссылку на встречу'
        />
        )}
        <MeetingModal
            isOpen={meetingState === 'isInstantMeeting'}
            onClose={() => setMeetingState(undefined)}
            title="Начать мгновенную встречу"
            className='text-center'
            buttonText='Начать встречу'
            handleClick={createMeeting}
        />
        <MeetingModal
            isOpen={meetingState === 'isJoiningMeeting'}
            onClose={() => setMeetingState(undefined)}
            title="Введите ссылку здесь"
            className='text-center'
            buttonText='Присоединиться к встрече'
            handleClick={() => router.push(values.link)}
        >
            <Input placeholder='Введите ссылку на встречу' className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0' onChange={(e) => setValues({...values,link:e.target.value})} />
        </MeetingModal>
    </section>
  )
}

export default MeetingTypeList
