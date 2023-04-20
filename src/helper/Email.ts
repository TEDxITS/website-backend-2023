import path from "path";
import nodemailer from "nodemailer";
import hbs, {NodemailerExpressHandlebarsOptions} from 'nodemailer-express-handlebars';
import env from "../config/LoadEnv";

export enum EmailType {
	REGISTRATION_VERIFICATION = "registration-verification",
	FORGET_PASSWORD = "forget-password",
	BOOKING_VERIFIED = "booking-verified",
	DEADLINE = "deadline",
}

const EmailSubjectMapping = {
	[EmailType.REGISTRATION_VERIFICATION]: "Your TEDxITS Account Email Verification",
	[EmailType.FORGET_PASSWORD]: "Request to Reset Your TEDxITS Account Password",
	[EmailType.BOOKING_VERIFIED]: "Your TEDxITS Event Booking Has Been Confirmed",
	[EmailType.DEADLINE]: "Urgent Update: TEDxITS Ticket Payment Deadline Changed to 21:00",
}

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: env.MAILER_EMAIL,
		pass: env.MAILER_PASS,
	},
});

const defaultEmailConfig = {
	from: {
		name: "TEDxITS 2023",
		address: String(process.env.MAILER_MAIL),
	},
}

type SendEmailConfig = {
	to: string;
	link?: string;
	type: EmailType;
	name: string
}

const handlebarOptions: NodemailerExpressHandlebarsOptions = {
	viewEngine: {
		extname: ".hbs",
		partialsDir: path.join(__dirname, "../asset/handlebar"),
		layoutsDir: path.join(__dirname, "../asset/handlebar"),
		defaultLayout: '',
	},
	viewPath: path.join(__dirname, "../asset/handlebar"),
	extName: ".hbs",
};

transporter.use("compile", hbs(handlebarOptions));

export async function sendEmail(config: SendEmailConfig) {
	const currentConfig = {
		...defaultEmailConfig,
		...config,
		subject: EmailSubjectMapping[config.type],
		context: {
			name: config.name,
			link: config.link
		},
		template: config.type,
		attachments: [
			{
			  filename: "tedxits2023.jpg",
			  path: path.join(__dirname, "../asset/image/tedxits2023.jpg"),
			  cid: "tedxits2023",
			}
		]
	}
	
	await transporter.sendMail({
		...currentConfig
	});
	transporter.close();
}
