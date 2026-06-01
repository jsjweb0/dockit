import { Component, type ReactNode } from 'react';
import { ErrorFallback } from '@/components/ErrorFallback';

type Props = {
    children: ReactNode;
    fallback?: ReactNode;
};

type State = {
    hasError: boolean;
};

export class ErrorBoundary extends Component<Props, State> {
    state: State = {
        hasError: false,
    };

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback ?? <ErrorFallback />
        }

        return this.props.children;
    }
}