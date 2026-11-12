import {
	Button,
	buttonVariants,
	Checkbox,
	Description,
	FieldError,
	Input,
	Label,
	Radio,
	RadioGroup,
	TextField,
} from "@heroui/react";
import { type ReactNode, useState } from "react";
import { cartTotals } from "../cart";
import { useCart } from "../cart-context";
import {
	type CheckoutErrors,
	type CheckoutForm,
	type Delivery,
	emptyCheckout,
	formatCardNumber,
	formatExpiry,
	orderNumber,
	type Payment,
	validateCheckout,
} from "../checkout";
import { SiteLink } from "../components/site-link";
import {
	emptyPlaceText,
	SuggestField,
	singlePostalCode,
	useCitySuggestions,
	usePlaceSuggestions,
} from "../components/suggest-field";
import { findInk, formatPrice, nameOf, priceOf } from "../data";
import { filterProvinces, type Place } from "../places";

/** How long the fake payment "processes" before confirming. */
const FAKE_PAYMENT_MS = 1200;

type Order = { id: string; form: CheckoutForm; total: number; count: number };

type FieldProps = {
	name: keyof CheckoutForm;
	label: string;
	form: CheckoutForm;
	errors: CheckoutErrors;
	onChange: (name: keyof CheckoutForm, value: string) => void;
	format?: (value: string) => string;
	description?: string;
	className?: string;
	autoComplete?: string;
	inputMode?: "email" | "tel" | "numeric" | "text";
	type?: "text" | "email" | "tel";
	placeholder?: string;
	isRequired?: boolean;
};

function Field({
	name,
	label,
	form,
	errors,
	onChange,
	format,
	description,
	className,
	isRequired = true,
	...input
}: FieldProps) {
	return (
		<TextField
			name={name}
			value={form[name]}
			onChange={(value) => onChange(name, format ? format(value) : value)}
			isInvalid={Boolean(errors[name])}
			isRequired={isRequired}
			validationBehavior="aria"
			className={className}
			autoComplete={input.autoComplete}
			type={input.type ?? "text"}
		>
			<Label className="font-semibold">{label}</Label>
			<Input
				placeholder={input.placeholder}
				inputMode={input.inputMode}
				className="h-12"
			/>
			{description && <Description>{description}</Description>}
			<FieldError>{errors[name]}</FieldError>
		</TextField>
	);
}

function Step({
	number,
	title,
	children,
}: {
	number: number;
	title: string;
	children: ReactNode;
}) {
	return (
		<section
			aria-labelledby={`paso-${number}`}
			className="border-t border-(--rule) pt-8"
		>
			<h2
				id={`paso-${number}`}
				className="flex items-center gap-3 text-2xl font-extrabold tracking-tight"
			>
				<span className="grid size-8 place-items-center rounded-full bg-(--ink) text-base text-white">
					{number}
				</span>
				{title}
			</h2>
			<div className="mt-6">{children}</div>
		</section>
	);
}

function OptionCard({
	value,
	title,
	detail,
	aside,
}: {
	value: string;
	title: string;
	detail: string;
	aside: string;
}) {
	return (
		<Radio
			value={value}
			className="flex-row! items-start! gap-3! rounded-2xl border border-(--rule) p-4 data-[selected=true]:border-(--ink) data-[selected=true]:bg-(--wash)"
		>
			<Radio.Control className="mt-1 shrink-0">
				<Radio.Indicator />
			</Radio.Control>
			<Radio.Content className="flex! min-w-0 flex-1 flex-row! items-start justify-between gap-3">
				<span className="min-w-0">
					<Label className="block font-bold">{title}</Label>
					{detail && (
						<Description className="mt-0.5 block">{detail}</Description>
					)}
				</span>
				{aside && <span className="shrink-0 font-semibold">{aside}</span>}
			</Radio.Content>
		</Radio>
	);
}

/** Street, postcode, city and province, with suggestions as you type. Any text is accepted. */
function AddressFields({
	form,
	errors,
	onChange,
}: {
	form: CheckoutForm;
	errors: CheckoutErrors;
	onChange: (changes: Partial<CheckoutForm>) => void;
}) {
	const streets = usePlaceSuggestions(
		form.address,
		"address",
		form.city || undefined,
	);
	const cities = useCitySuggestions(form.city);
	const provinceItems = filterProvinces(form.province).map((name) => ({
		id: name,
		label: name,
	}));
	const fill = (place: Place) =>
		onChange({
			...(place.street ? { address: place.street } : {}),
			...(place.postcode ? { postalCode: place.postcode } : {}),
			...(place.city ? { city: place.city } : {}),
			...(place.province ? { province: place.province } : {}),
		});

	return (
		<>
			<SuggestField
				label="Dirección"
				className="sm:col-span-2"
				value={form.address}
				onChange={(address) => onChange({ address })}
				items={streets.places}
				onPick={fill}
				error={errors.address}
				placeholder="Calle y número"
				autoComplete="street-address"
				emptyText={emptyPlaceText(form.address, streets.status, "calles")}
			/>
			<Field
				name="postalCode"
				label="Código postal"
				autoComplete="postal-code"
				inputMode="numeric"
				form={form}
				errors={errors}
				onChange={(name, value) => onChange({ [name]: value })}
			/>
			<SuggestField
				label="Ciudad"
				value={form.city}
				onChange={(city) => onChange({ city })}
				items={cities.places}
				onPick={(place) => {
					fill(place);
					// Many towns have a single postal code: fill it in too.
					singlePostalCode(place.id).then(
						(postalCode) => postalCode && onChange({ postalCode }),
					);
				}}
				error={errors.city}
				autoComplete="address-level2"
				emptyText={
					cities.loading
						? "Cargando municipios…"
						: form.city.trim().length < 2
							? "Escribe al menos 2 letras."
							: "Ningún municipio coincide. Puedes escribirlo a mano."
				}
			/>
			<SuggestField
				label="Provincia"
				className="sm:col-span-2"
				value={form.province}
				onChange={(province) => onChange({ province })}
				items={provinceItems}
				onPick={(item) => onChange({ province: item.label })}
				error={errors.province}
				autoComplete="address-level1"
				emptyText="Ninguna provincia coincide. Puedes escribirla a mano."
			/>
		</>
	);
}

export function CheckoutPage() {
	const cart = useCart();
	const [form, setForm] = useState<CheckoutForm>(emptyCheckout);
	const [errors, setErrors] = useState<CheckoutErrors>({});
	const [submitted, setSubmitted] = useState(false);
	const [paying, setPaying] = useState(false);
	const [order, setOrder] = useState<Order | null>(null);

	const totals = cartTotals(cart, priceOf, form.delivery);

	const patch = (changes: Partial<CheckoutForm>) => {
		const next = { ...form, ...changes };
		setForm(next);
		// After the first attempt, errors follow the user's corrections live.
		if (submitted) setErrors(validateCheckout(next));
	};

	const update = (name: keyof CheckoutForm, value: string) =>
		patch({ [name]: value });

	const submit = () => {
		setSubmitted(true);
		const found = validateCheckout(form);
		setErrors(found);
		if (Object.keys(found).length > 0) {
			requestAnimationFrame(() =>
				document
					.querySelector<HTMLElement>('.plumin [aria-invalid="true"]')
					?.focus(),
			);
			return;
		}
		setPaying(true);
		window.setTimeout(() => {
			// The card never leaves this component: only what the confirmation shows is kept.
			setOrder({
				id: orderNumber(),
				form: { ...form, cardNumber: form.cardNumber.slice(-4), cardCvc: "" },
				total: totals.total,
				count: totals.count,
			});
			cart.dispatch({ type: "clear" });
			setPaying(false);
			window.scrollTo({ top: 0 });
		}, FAKE_PAYMENT_MS);
	};

	if (order) return <Confirmation order={order} />;

	if (totals.count === 0) {
		return (
			<main className="mx-auto max-w-3xl px-4 pt-16 sm:px-8">
				<h1 className="text-5xl font-extrabold tracking-[-0.04em]">
					Finalizar compra
				</h1>
				<p className="mt-4 text-lg">
					Tu carrito está vacío, así que no hay nada que pagar.
				</p>
				<SiteLink to="tintas" className={buttonVariants({ className: "mt-6" })}>
					Ver las tintas
				</SiteLink>
			</main>
		);
	}

	const fieldProps = { form, errors, onChange: update };

	return (
		<main className="mx-auto max-w-6xl px-4 pt-10 sm:px-8">
			<SiteLink
				to="carrito"
				className="text-sm text-(--ink-soft) hover:underline"
			>
				Volver al carrito
			</SiteLink>
			<h1 className="mt-2 text-5xl font-extrabold tracking-[-0.04em]">
				Finalizar compra
			</h1>
			<p className="mt-3 max-w-[60ch] rounded-xl bg-[#fff6d6] px-4 py-3 text-sm text-[#5c4300]">
				Pago de prueba: vale cualquier dato.
			</p>

			<div className="mt-10 grid gap-12 lg:grid-cols-[1fr_24rem]">
				<form
					noValidate
					onSubmit={(event) => {
						event.preventDefault();
						submit();
					}}
					className="flex flex-col gap-10"
				>
					<Step number={1} title="Contacto">
						<Field
							name="email"
							label="Correo electrónico"
							type="email"
							inputMode="email"
							autoComplete="email"
							{...fieldProps}
						/>
						<Checkbox className="mt-4 flex-row! items-center! gap-3!">
							<Checkbox.Control>
								<Checkbox.Indicator />
							</Checkbox.Control>
							<Checkbox.Content>
								<Label>Avisadme cuando lleguen tintas nuevas</Label>
							</Checkbox.Content>
						</Checkbox>
					</Step>

					<Step number={2} title="Entrega">
						<RadioGroup
							aria-label="Forma de entrega"
							value={form.delivery}
							onChange={(value) => update("delivery", value as Delivery)}
							className="grid gap-3"
						>
							<OptionCard
								value="domicilio"
								title="Envío a domicilio"
								detail="24-48 h"
								aside={totals.subtotal >= 40 ? "Gratis" : formatPrice(4.9)}
							/>
							<OptionCard
								value="tienda"
								title="Recoger en la tienda"
								detail="Ave María 31, en unas 2 h"
								aside="Gratis"
							/>
						</RadioGroup>

						<div className="mt-6 grid gap-4 sm:grid-cols-2">
							<Field
								name="firstName"
								label="Nombre"
								autoComplete="given-name"
								{...fieldProps}
							/>
							<Field
								name="lastName"
								label="Apellidos"
								autoComplete="family-name"
								{...fieldProps}
							/>
							{form.delivery === "domicilio" && (
								<AddressFields form={form} errors={errors} onChange={patch} />
							)}
							<Field
								name="phone"
								label="Teléfono"
								type="tel"
								inputMode="tel"
								autoComplete="tel-national"
								className="sm:col-span-2"
								{...fieldProps}
							/>
						</div>
					</Step>

					<Step number={3} title="Pago">
						<RadioGroup
							aria-label="Forma de pago"
							value={form.payment}
							onChange={(value) => update("payment", value as Payment)}
							className="grid gap-3 sm:grid-cols-2"
						>
							<OptionCard value="tarjeta" title="Tarjeta" detail="" aside="" />
							<OptionCard value="bizum" title="Bizum" detail="" aside="" />
						</RadioGroup>

						{form.payment === "tarjeta" ? (
							<div className="mt-6 grid gap-4 sm:grid-cols-4">
								<Field
									name="cardNumber"
									label="Número de tarjeta"
									inputMode="numeric"
									autoComplete="off"
									placeholder="1234 5678 9012 3456"
									format={formatCardNumber}
									className="sm:col-span-4"
									{...fieldProps}
								/>
								<Field
									name="cardName"
									label="Titular"
									autoComplete="off"
									className="sm:col-span-2"
									{...fieldProps}
								/>
								<Field
									name="cardExpiry"
									label="Caducidad"
									inputMode="numeric"
									autoComplete="off"
									placeholder="MM/AA"
									format={formatExpiry}
									{...fieldProps}
								/>
								<Field
									name="cardCvc"
									label="CVC"
									inputMode="numeric"
									autoComplete="off"
									placeholder="123"
									format={(v) => v.replace(/\D/g, "").slice(0, 4)}
									{...fieldProps}
								/>
							</div>
						) : (
							<div className="mt-6 max-w-sm">
								<Field
									name="bizumPhone"
									label="Móvil de Bizum"
									type="tel"
									inputMode="tel"
									autoComplete="off"
									{...fieldProps}
								/>
							</div>
						)}
					</Step>

					<Button
						type="submit"
						size="lg"
						isPending={paying}
						className="h-14 text-lg font-bold"
					>
						{paying
							? "Procesando el pago…"
							: `Pagar ${formatPrice(totals.total)}`}
					</Button>
				</form>

				<OrderSummary delivery={form.delivery} />
			</div>
		</main>
	);
}

function OrderSummary({ delivery }: { delivery: Delivery }) {
	const { lines } = useCart();
	const totals = cartTotals({ lines }, priceOf, delivery);
	return (
		<aside
			aria-label="Resumen del pedido"
			className="self-start rounded-3xl bg-(--wash) p-6 lg:sticky lg:top-28"
		>
			<h2 className="text-xl font-extrabold">Tu pedido</h2>
			<ul className="mt-4 divide-y divide-(--rule)">
				{lines.map((line) => {
					const ink = findInk(line.id);
					return (
						<li key={line.id} className="flex items-center gap-3 py-3">
							<span
								className="relative size-10 shrink-0 rounded-full"
								style={{ background: ink?.color ?? "var(--ink)" }}
								aria-hidden="true"
							/>
							<span className="flex-1">
								<span className="block font-semibold">{nameOf(line.id)}</span>
								<span className="text-sm text-(--ink-soft)">
									{line.qty} × {formatPrice(priceOf(line.id) ?? 0)}
								</span>
							</span>
							<span className="font-semibold">
								{formatPrice((priceOf(line.id) ?? 0) * line.qty)}
							</span>
						</li>
					);
				})}
			</ul>
			<dl className="mt-4 grid grid-cols-[1fr_auto] gap-y-2 border-t border-(--rule) pt-4">
				<dt>Subtotal</dt>
				<dd className="text-right">{formatPrice(totals.subtotal)}</dd>
				<dt>{delivery === "tienda" ? "Recogida" : "Envío"}</dt>
				<dd className="text-right">
					{totals.shipping === 0 ? "Gratis" : formatPrice(totals.shipping)}
				</dd>
				<dt className="mt-2 text-lg font-bold">Total</dt>
				<dd className="mt-2 text-right text-lg font-bold">
					{formatPrice(totals.total)}
				</dd>
			</dl>
			<SiteLink
				to="carrito"
				className="mt-4 inline-block text-sm underline underline-offset-4"
			>
				Editar el carrito
			</SiteLink>
		</aside>
	);
}

function Confirmation({ order }: { order: Order }) {
	const { form } = order;
	return (
		<main className="mx-auto max-w-3xl px-4 pt-14 sm:px-8">
			<p className="inline-flex items-center gap-2 rounded-full bg-[#e3f4e8] px-3 py-1 text-sm font-semibold text-[#14532d]">
				<span aria-hidden="true">✓</span> Pago simulado aceptado
			</p>
			<h1 className="mt-4 text-5xl font-extrabold tracking-[-0.04em]">
				Pedido confirmado
			</h1>
			<p className="mt-4 text-lg">
				Gracias, {form.firstName}. Tu número de pedido es{" "}
				<strong>{order.id}</strong>. Confirmación enviada a{" "}
				<strong>{form.email}</strong>.
			</p>

			<dl className="mt-10 grid gap-6 rounded-3xl bg-(--wash) p-6 sm:grid-cols-2">
				<div>
					<dt className="text-sm text-(--ink-soft)">Entrega</dt>
					<dd className="mt-1 font-semibold">
						{form.delivery === "tienda" ? (
							<>
								Recoger en la tienda
								<span className="block font-normal">
									Calle del Ave María 31, Madrid. Te avisamos al {form.phone}.
								</span>
							</>
						) : (
							<>
								Envío a domicilio
								<span className="block font-normal">
									{form.address}, {form.postalCode} {form.city}
								</span>
							</>
						)}
					</dd>
				</div>
				<div>
					<dt className="text-sm text-(--ink-soft)">Pago</dt>
					<dd className="mt-1 font-semibold">
						{form.payment === "tarjeta"
							? `Tarjeta acabada en ${form.cardNumber}`
							: "Bizum"}
						<span className="block font-normal">
							{formatPrice(order.total)} por {order.count}{" "}
							{order.count === 1 ? "artículo" : "artículos"}
						</span>
					</dd>
				</div>
			</dl>
			<SiteLink to="tintas" className={buttonVariants({ className: "mt-6" })}>
				Seguir mirando tintas
			</SiteLink>
		</main>
	);
}
