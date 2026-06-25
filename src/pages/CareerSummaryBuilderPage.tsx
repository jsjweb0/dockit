import { CareerSummaryForm } from '@/features/careerSummary/ui/CareerSummaryForm';
import { useCareerSummaryEditor } from '@/features/careerSummary/context/careerSummaryEditor.context';
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
    const { careerSummary, setCareerSummary, previewRef } = useCareerSummaryEditor();

    return (
        <DocumentBuilderLayout
            form={<CareerSummaryForm value={careerSummary} onChange={setCareerSummary} />}
            preview={<CareerSummaryPreview value={careerSummary} />}
            previewRef={previewRef}
            previewControls={previewControls}
        />
    );
}
