"use client";

import {
  IconCopy,
  IconStar,
  IconThumbDown,
  IconThumbUp,
  IconVolume,
} from "@tabler/icons-react";
import "regenerator-runtime/runtime";
import SpeechRecognitionComponent from "@/components/SpeechRecognition/SpeechRecognitionComponent";

import FileUpload from "@/components/Inputs/FileUpload"
import LinkPaste from "@/components/Inputs/LinkPaste"
import LanguageSelector from "@/components/Inputs/LanguageSelector"
import TextArea from "@/components/Inputs/TextArea";
import CategoryLinks from "@/components/categoryLinks";
import React, { ChangeEvent, useState } from "react";
import useTranslate from "@/hooks/useTranslate"
import { rtfToText } from "@/utils/rtfToText";
import SvgDecorations from "@/components/SvgDecorations";

export default function Home() {
  const [sourceText, setSourceText] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [favourite, setFavourite] = useState<boolean>(false);
  const languages:string[] = [
    "English",
    "Spanish",
    "French",
    "German",
    "Chinese",
  ];

  const [selectedLanguage, setSelectedLanguage] = useState<string>("Spanish")
  const targetText = useTranslate(sourceText, selectedLanguage)

  const handleAudioPlayback = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    window.speechSynthesis.speak(utterance)
  }

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if(file) {
      const reader = new FileReader();
      reader.onload = () => {
        const rtfContent = reader.result as string
        const text = rtfToText(rtfContent)
        setSourceText(reader.result as string);
      };
      reader.readAsText(file);
    }
  }

  const handleLinkPaste = async (event: ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value

    try {
      const response = await fetch(url);
      const text = await response.text();
      setSourceText(text);
    } catch (error) {
      console.error('Error fetching text from URL:', error);
    }
  } 

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(targetText)
    setCopied(true)
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleFavourite = () => {
    setFavourite(!favourite);

  }
  return (
    <div>
      <div className="h-[50rem] w-full dark:bg-black bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex items-center justify-center">
        {/* Radial gradient for the container to give a faded look */}
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="relative overflow-hidden h-screen">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 py-10 sm:py-24 ">
            <div className="text-center">
              <h1 className="text-4xl sm:text:6xl font-bold text-neutral-200">
                Just<span className="text-[#f87315]">Speak</span>
              </h1>
              <p className="mt-3 text-neutral-400">
                JustSpeak: Bridging Voices, Connecting Worls
              </p>

              <div className="mt-7 sm:mt-12 mx-auto max-w-3xl relative">
                <div className="grid gap-4 md:grid-cols-2 grid-cols-1">
                  <div className="relative z-10 p-3 flex flex-col space-x-3 border rounded-lg shadow-lg bg-neutral-900 border-neutral-700 shadow-gray-900/20">
                    <TextArea
                      id="source-language"
                      value={sourceText}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                        setSourceText(e.target.value);
                      }}
                      placeholder={"Source Language"}
                    />

                    <div className="flex flex-row justify-between w-full">
                      <span className="cursor-pointer flex space-x-2 flex-row">
                        <SpeechRecognitionComponent
                          setSourceText={setSourceText}
                        />
                        <IconVolume size={22} onClick={() => handleAudioPlayback(sourceText)} />
                        {/* TODO: file upload component */}
                        <FileUpload handleFileUpload={handleFileUpload} />
                        <LinkPaste handleLinkPaste={handleLinkPaste} />
                        
                      </span>
                      <span className="text-sm pr-4">
                        {sourceText.length}/2000
                      </span>
                    </div>
                  </div>

                  <div className="relative z-10 p-3 flex flex-col space-x-3 border rounded-lg shadow-lg bg-neutral-900 border-neutral-700 shadow-gray-900/20">
                      <TextArea id={'target-language'}
                      value={targetText}
                      onChange={() => {}}
                      placeholder={"Target Language"}
                      />
                      <div className="flex flex-row justify-between w-full">
                        <span className="cursor-pointer flex space-x-2">
                          <LanguageSelector
                            selectedLanguage={selectedLanguage}
                            setSelectedLanguage={setSelectedLanguage}
                            languages={languages}
                          />
                          <IconVolume size={22} onClick={() => handleAudioPlayback(targetText)}/>
                        </span>
                        <div className="flex flex-row itmes-center space-x-2 pr-4 cursor-pointer">
                          <IconCopy size={22} onClick={handleCopyToClipboard}/>
                          {copied && <span className="text-xs text-green-500">Copied!</span>}
                          <IconThumbUp size={22} />
                          <IconThumbDown size={22} />
                          <IconStar size={22} onClick={handleFavourite} className={favourite ? "text-yellow-500" : ""} />
                        </div>
                      </div>
                  </div>
                </div>
                <SvgDecorations />
              </div>
              <CategoryLinks />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
