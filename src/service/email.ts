import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	pool: true,
	auth: {
		user: process.env.MAILER_EMAIL,
		pass: process.env.MAILER_PASS,
	},
});

type NodeMailerProps = {
	from?: string;
	to: string;
	subject: string;
	text?: string;
	html?: string;
};

export async function sendEmail(config: NodeMailerProps) {
	await transporter.sendMail({
		...config,
		from: config.from || {
			name: "TEDxITS 2023",
			address: String(process.env.MAILER_MAIL),
		},
	});
	transporter.close();
}
