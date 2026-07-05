'use client';


import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import { Lang, translations } from "./translations";



export type LangContextValue = {
	lang: Lang,
	setLang: Dispatch<SetStateAction<Lang>>
	t: (typeof translations)[Lang]

}


const LangContext = createContext<LangContextValue | null>(null);

function detectBrowserLang(): Lang {
	if (typeof window === 'undefined') return 'en'
	const browserLang = navigator.language.slice(0, 2) // "vi", "zh", "en"...
	if (browserLang === 'zh') return 'cn'
	if (browserLang === 'vi') return 'vi'
	return 'en' // fallback
}

export function LangProvider({ children }: { children: ReactNode }) {

	const [lang, setLang] = useState<Lang>(() => {
		if (typeof window === 'undefined') return 'en'
		const cookie = document.cookie
			.split('; ')
			.find(row => row.startsWith('lang='))
			?.split('=')[1]
		return (cookie as Lang) ?? detectBrowserLang()
	})

	useEffect(() => {
		document.cookie = `lang=${lang}; path=/; max-age=31536000`
	}, [lang])

	const t = translations[lang]

	return <LangContext.Provider value={{ lang, setLang, t }}>
		{children}
	</LangContext.Provider>


}


export function useLang() {
	const langContext = useContext(LangContext);

	if (!langContext) {
		throw new Error("LangContext must be used within its corresponding LangProvider")
	}
	return langContext;
}