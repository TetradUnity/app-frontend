import Foreground from "@/components/Foreground";
import BackButton from "@/components/subject/BackButton";
import { EducationService } from "@/services/education.service";
import { SubjectNamespace } from "@/types/api.types";
import translateRequestError from "@/utils/ErrorUtils";
import { Spin } from "antd";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AssigmnentsIdPage() {
    const { id } = useParams();

    const [isLoading, setLoading] = useState(true);
    const [material, setMaterial] = useState<(SubjectNamespace.ISingleEducationMaterial & SubjectNamespace.ISingleEducationTest) | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        let educationId = parseInt(id as string);

        if (!educationId || educationId < 0) {
            setError("not_found");
            return;
        }

        EducationService.getEducationMaterial(educationId).then(response => {
            if (!response.data) {
                setError(response.error_code as string);
                return;
            }

            
            setLoading(false);
        })
    }, []);

    if (error) {
        return (
           <Foreground style={{height: 100}}>
               <BackButton />
               <p style={{textAlign: "center", fontSize: 30}}>Трапилась помилка: {translateRequestError(error)}</p>
           </Foreground>
       )
   }

   if (isLoading) {
       return (
           <Foreground style={{height: 100}}>
               <BackButton />
               <Spin style={{display: "block", margin: "auto"}} spinning />
           </Foreground>
       )
   }

   return (
        <Foreground>
            <BackButton />
            
        </Foreground>
   )
}