import {
    BindingIdentifier,
} from "@aedart/contracts/dist/container";

/**
 * List of dependencies
 *
 * Can contain binding identifiers known by a Service Container or
 * perhaps references to classes.
 */
export type DependenciesList = BindingIdentifier[];
