
export async function sendEmail(config: NodeMailerProps) {
	const result = await transporter.sendMail({
		...config,
		from: config.from || {
			name: "TEDxITS 2023",
			address: String(process.env.MAILER_MAIL),
		},
	});
	await transporter.close();
	return result;
}