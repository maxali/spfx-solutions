import { MSGraph } from '.';
import { GraphHttpClient } from '@microsoft/sp-http';
import { Web, Site } from '@pnp/sp';

export class Functions {
    public static async CreateTeam(graphHttpClient: GraphHttpClient, groupId: string, siteUrl: string) {
        console.log("Creating team");
        await MSGraph.Put(graphHttpClient, `beta/groups/${groupId}/team`, "{}");

        let endPointInfo = await MSGraph.Get(graphHttpClient, `beta/groups/${groupId}/endpoints`);
        if (endPointInfo && endPointInfo.value) {
            let info = endPointInfo.value.find(element => { return element.providerName === 'Microsoft Teams'; });
            let currentWeb = new Web(siteUrl);
            await currentWeb.navigation.quicklaunch.add("Teams", info.uri);
            console.log("Adding teams link");
        }
    }

    public static async RemoveCustomizer(siteUrl: string, componentId: string) {
        // Remove custom action from current sute
        let site = new Site(siteUrl);
        let customActions = await site.userCustomActions.get();
        for (let i = 0; i < customActions.length; i++) {
            var instance = customActions[i];
            if (instance.ClientSideComponentId === componentId) {
                await site.userCustomActions.getById(instance.Id).delete();
                console.log("Teams creation extension removed");
                window.location.href = window.location.href;
                break;
            }
        }
    }
}