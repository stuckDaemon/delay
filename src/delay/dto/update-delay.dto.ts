export class UpdateDeliveryDto {
  id: string;
  customerName?: string;
  contact?: string;
  origin?: string;
  destination?: string;
  lastKnownDelay?: number;
  delivered?: boolean;
}
