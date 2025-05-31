export interface NavItem {
    // Core properties
    displayName?: string;  // Made optional to support section headers
    iconName?: string;
    route?: string | string[];
    children?: NavItem[];
    navCap?: string;
    
    // Optional properties
    title?: string; // Alias for displayName
    badge?: string | number;
    badgeClass?: string;
    disabled?: boolean;
    external?: boolean;
    twoLines?: boolean;
    chip?: boolean;
    chipContent?: string;
    chipClass?: string;
    subtext?: string;
    ddType?: string;
    roles?: string[];
    class?: string;
    
    // Add any additional properties used in the templates
    expanded?: boolean;
    active?: boolean;
    divider?: boolean;
    target?: string;
    type?: string;
    // Add any other properties that might be needed
}
