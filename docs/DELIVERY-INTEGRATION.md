# Delivery Integration - Tunisian Providers Abstraction

## Interface

```ts
interface DeliveryProvider {
  name: string
  createShipment(order: Order): Promise<Shipment>
  getShipment(shipmentId: string): Promise<Shipment>
  trackShipment(trackingNumber: string): Promise<TrackingInfo>
  cancelShipment(shipmentId: string): Promise<void>
  calculateDeliveryFee(governorate: string, city?: string, weight?: number): Promise<number>
}
```

## Providers

### MesColis (Tunisia)
- Website: mescolis.tn (verify)
- Creds: API_KEY, BASE_URL
- Fee: 7-8 TND
- Status: not_configured if env empty
- Docs: Need official API docs - if unavailable use Mock

### Aramex
- International, Tunisia presence
- Creds: USERNAME, PASSWORD, ACCOUNT_NUMBER, ACCOUNT_PIN, ACCOUNT_ENTITY
- Fee: 10 TND domestic
- API: SOAP/REST shipping API
- Status: not_configured

### First Delivery
- Tunisian
- Creds: TOKEN
- Fee: 8 TND
- Status: not_configured

### Best Delivery
- Tunisian
- Creds: API_KEY
- Fee: 8 TND
- Status: not_configured

### Navex
- Tunisian
- Creds: API_KEY
- Fee: 9 TND
- Status: not_configured

### INTIGO
- Tunisian last-mile
- Creds: API_KEY
- Fee: 9 TND
- Status: not_configured

### MockDeliveryProvider (test)

Used when no credentials or docs unavailable. Implements interface with:
- createShipment: returns mock tracking number MOCK-xxx, fee based on governorate (Tunis 7, other 10, free if subtotal >=150), status pending, provider_response {mock: true}
- getShipment: returns mock shipment
- trackShipment: returns random status progression
- cancelShipment: mock cancel
- calculateDeliveryFee: 7 if Tunis else 10, 0 if >=150

Label status clearly: mock

## Factory

`getDeliveryProvider(name): DeliveryProvider`
- If env vars present for provider -> return real adapter (future)
- Else return MockDeliveryProvider with warning logged

`calculateDeliveryFeeByGovernorate(gov, subtotal, threshold=150): number`
- If subtotal >= threshold return 0
- If gov === 'Tunis' return 7 else 10

## No Fake Integration Rule

- Never invent API endpoints, request/response formats
- If docs unavailable, use Mock and document: "Credential required: API_KEY, docs at https://... Status: not_configured"
- Admin UI shows status badge: configured / not_configured / mock / test / production
- Log warning if attempting real shipment with mock provider

## Shipment Flow

1. Order created via 15-step validation
2. Server calls `deliveryProvider.createShipment(order)` with order details (customer name, phone, governorate, city, address, items, COD amount)
3. Provider returns tracking_number, fee, status
4. Create shipment row: order_id, provider, tracking_number, status, fee, provider_response JSONB
5. Update order status to shipped when tracking active
6. Track via `trackShipment` polling or webhook (future)

## Tunisian Specifics

- 24 governorates list constant
- COD first-class: all providers must support COD
- Phone format +216 validation
- Address free text, but governorate required for fee calculation
- Free shipping threshold 150 TND common

## Admin UI

- DeliveryPage shows list of providers, fee, status, creds required
- Config form for each provider (API keys)
- Test shipment button (mock)
- No fake data
