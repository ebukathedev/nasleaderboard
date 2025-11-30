import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const nasMain = localFont({
	src: [
		{
			path: "../fonts/nas-main.ttf",
			weight: "400",
			style: "normal",
		},
	],
	variable: "--font-nas-main",
});

export const metadata: Metadata = {
	title: "NAS Leaderboard — Live Vote Tracker",
	description:
		"Track real-time votes for all Next Afrobeats Star contestants. See who’s leading, who’s rising, and who might be eliminated. Updated automatically every few seconds.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={` ${nasMain.variable} antialiased`}>
				{children}
				<Analytics />
			</body>
		</html>
	);
}
