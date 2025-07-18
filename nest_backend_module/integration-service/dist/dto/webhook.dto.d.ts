export declare class ContactInfo {
    name: string;
    email: string;
    phone?: string;
    company?: string;
}
export declare class WebhookDto {
    source: string;
    event: string;
    contact: ContactInfo;
    message?: string;
    data?: any;
}
