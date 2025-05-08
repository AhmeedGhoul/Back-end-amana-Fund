import { Police } from './police.model';
import { inject } from '@angular/core';
import { PoliceService } from './../../services/police.service';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Observable } from 'rxjs';

export const PoliceResolver : ResolveFn<any> =
    (route : ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
        policeService: PoliceService = inject(PoliceService)) :Observable<Police> =>{
            const idPolice = route.paramMap.get("idPolice");

            if(idPolice){
                return policeService.getPoliceById(idPolice);
            }

        }