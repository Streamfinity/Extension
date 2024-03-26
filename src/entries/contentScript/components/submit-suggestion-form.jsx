import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { searchSuggestionAccounts, submitSuggestion } from '~/common/bridge';
import Button from '~/entries/contentScript/components/button';
import styles from '~/styles/input.module.css';
import { useAppStore, MESSAGE_SUCCESS, MESSAGE_ERROR } from '~/entries/contentScript/state';

const RESULTS_PENDING = 0;
const RESULTS_LOADING = 1;
const RESULTS_EMPTY = 2;
const RESULTS_OK = 3;

function SubmitSuggestionForm({ onSubmit }) {
    const setAppMessage = useAppStore((state) => state.setAppMessage);

    const [hasLoadedSuggestedAccounts, setHasLoadedSuggestedAccounts] = useState(false);
    const [suggestedAccounts, setSuggestedAccounts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchedAccounts, setSearchedAccounts] = useState([]);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    const canSubmit = useMemo(() => !isLoading && !!selectedAccount?.id, [selectedAccount, isLoading]);

    function reset() {
        setSearchTerm('');
        setSearchedAccounts([]);
        setSelectedAccount(null);
        onSubmit();
    }

    async function searchAccounts() {
        if (!searchTerm || searchTerm.trim().length === 0) {
            return;
        }

        setLoadingSearch(true);
        setSearchedAccounts(
            await searchSuggestionAccounts({ query: searchTerm }) || [],
        );
        setLoadingSearch(false);
    }

    async function submit() {
        if (isLoading) {
            return;
        }

        setIsLoading(true);

        try {
            const data = {};

            if (selectedAccount.account) {
                data.account_id = selectedAccount.id;
            } else {
                data.to_unknown_service = selectedAccount.service.id;
                data.to_unknown_service_user_id = selectedAccount.id;
            }

            const suggestion = await submitSuggestion({
                video_url: window.location.href,
                ...data,
            });

            setAppMessage({ type: MESSAGE_SUCCESS, message: 'Suggestion submitted successfully' });
            onSubmit(suggestion);
        } catch (err) {
            setAppMessage({ type: MESSAGE_ERROR, message: err });
        }

        setIsLoading(false);
    }

    function onInput(e) {
        e.stopPropagation();
        e.preventDefault();
        setSearchTerm(e.target.value);
    }

    /**
     * @param {KeyboardEvent} e
     */
    function disableWebsiteHotkeys(e) {
        e.stopPropagation();
    }

    useEffect(() => {
        window.addEventListener('keydown', disableWebsiteHotkeys, true);

        return () => {
            window.removeEventListener('keydown', disableWebsiteHotkeys, true);
        };
    }, []);

    const accounts = useMemo(() => {
        if (searchedAccounts.length > 0) {
            return searchedAccounts || [];
        }

        return suggestedAccounts || [];
    }, [suggestedAccounts, searchedAccounts]);

    const resultStatus = useMemo(() => {
        if (loadingSearch) {
            return RESULTS_LOADING;
        }

        if (!searchTerm) {
            return RESULTS_PENDING;
        }

        if (accounts?.length > 0) {
            return RESULTS_OK;
        }

        return RESULTS_EMPTY;
    }, [searchTerm, accounts, loadingSearch]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            searchAccounts();
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    useEffect(() => {
        async function fetch() {
            setSuggestedAccounts(
                await searchSuggestionAccounts({ query: '' }),
            );
            setHasLoadedSuggestedAccounts(true);
        }

        if (!hasLoadedSuggestedAccounts) {
            fetch();
        }
    }, []);

    return (
        <div>
            <p className="text-sm">
                You can submit the currently playing video as a suggestion for any streamer.
            </p>
            <div className="mt-4">
                <input
                    autoFocus
                    type="text"
                    autoComplete="off"
                    placeholder="Search here..."
                    onChange={(e) => onInput(e)}
                    className={styles.input}
                />

                <div className={classNames(
                    'flex flex-col h-64 py-2 overflow-y-auto',
                    accounts.length > 0 ? 'gap-1' : 'justify-center',
                )}
                >
                    {accounts.length === 0 && (
                        <div className="px-16 text-center text-gray-300">
                            {resultStatus === RESULTS_PENDING && ('Start typing the creator name to search')}
                            {resultStatus === RESULTS_LOADING && ('Loading...')}
                            {resultStatus === RESULTS_EMPTY && ('The creator is not signed up or has disabled video suggestions')}
                        </div>
                    )}
                    {accounts?.map((account) => (
                        <button
                            type="button"
                            key={account.id}
                            className={classNames(
                                account.id === selectedAccount?.id ? 'bg-primary-500/20' : 'hover:bg-white/10',
                                'flex items-center gap-2 py-2 px-3 rounded-md cursor-pointer transition-colors duration-100',
                            )}
                            onClick={() => setSelectedAccount(account)}
                        >
                            {account.avatar_url && (
                                <img
                                    src={account.avatar_url}
                                    alt={account.display_name}
                                    className="size-16 rounded-full"
                                />
                            )}
                            <div className="flex flex-col items-start">
                                <div className="font-semibold">
                                    {account.display_name}
                                </div>
                                <div className="text-xs opacity-50">
                                    {account.service.title}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                <Button
                    disabled={!canSubmit}
                    loading={isLoading}
                    color="primary"
                    type="button"
                    className="w-full"
                    onClick={() => submit()}
                >
                    Submit
                </Button>
            </div>

            <button
                onClick={() => reset()}
                type="button"
                className="mt-4 w-full text-center text-sm text-gray-500 transition-colors hover:text-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            >
                Abort
            </button>
        </div>
    );
}

SubmitSuggestionForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
};

SubmitSuggestionForm.defaultProps = {};

export default SubmitSuggestionForm;
