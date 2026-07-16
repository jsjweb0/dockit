import { CareerSummaryForm } from '@/features/careerSummary/ui/CareerSummaryForm';
import { useCareerSummaryEditor } from '@/features/careerSummary/context/careerSummaryEditor.context';
import { useCareerSummaryValidation } from '@/features/careerSummary/hooks/useCareerSummaryValidation';
import { useOutletContext } from 'react-router-dom';
import { CareerSummaryPreview } from '@/features/careerSummary/ui/CareerSummaryPreview';
import {
    DocumentBuilderLayout,
    type DocumentPreviewControls,
} from '@/features/documents/ui/DocumentBuilderLayout';

type CareerSummaryBuilderOutletContext = {
    previewControls: DocumentPreviewControls;
};

export function CareerSummaryBuilderPage() {
    const { previewControls } = useOutletContext<CareerSummaryBuilderOutletContext>();
    const { careerSummary, setCareerSummary } = useCareerSummaryEditor();
    const {
        experienceErrors,
        revalidateExperience,
        touchCareerSummary,
    } = useCareerSummaryValidation();

    return (
        <DocumentBuilderLayout
            form={
                <CareerSummaryForm
                    value={careerSummary}
                    onChange={setCareerSummary}
                    errors={experienceErrors}
                    onSectionBlur={touchCareerSummary}
                    onSectionChange={revalidateExperience}
                />
            }
            preview={<CareerSummaryPreview value={careerSummary} />}
            previewControls={previewControls}
        />
    );
}
