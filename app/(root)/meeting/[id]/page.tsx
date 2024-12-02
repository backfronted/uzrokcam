"use client";

import Loader from '@/components/Loader';
import MeetingRoom from '@/components/MeetingRoom';
import MeetingSetup from '@/components/MeetingSetup';
import { useGetCallById } from '@/hooks/useGetCallById';
import { useUser } from '@clerk/nextjs';
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

const Meeting = () => {
  const params = useParams();
  const id = params?.id; // Извлекаем параметр id
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const { user, isLoaded } = useUser();
  const { call, isCallLoading } = useGetCallById(id || '');

  useEffect(() => {
    if (!id) {
      console.error("Meeting ID not found in params");
    }
  }, [id]);

  if (!isLoaded || isCallLoading) return <Loader />;

  if (!id) {
    return <div>Error: Meeting ID not provided.</div>;
  }

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          ) : (
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default Meeting;
