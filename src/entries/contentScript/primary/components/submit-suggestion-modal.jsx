import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { searchSuggestionAccounts, submitSuggestion } from '~/common/bridge';
import Button from '~/entries/contentScript/primary/components/button';
import styles from '~/styles/input.module.css';

const RESULTS_PENDING = 0;
const RESULTS_LOADING = 1;
const RESULTS_EMPTY = 2;
const RESULTS_OK = 3;

function SubmitSuggestionModal({ onSubmit }) {
    const [hasLoadedSuggestedAccounts, setHasLoadedSuggestedAccounts] = useState(false);
    const [suggestedAccounts, setSuggestedAccounts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchedAccounts, setSearchedAccounts] = useState([]);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const canSubmit = useMemo(() => !loadingSubmit && !!selectedAccount?.id, [selectedAccount, loadingSubmit]);

    async function searchAccounts() {
        setLoadingSearch(true);
        setSearchedAccounts(
            await searchSuggestionAccounts({ query: searchTerm }),
        );
        setLoadingSearch(false);
    }

    async function submit() {
        setLoadingSubmit(true);

        const suggestion = await submitSuggestion({
            video_url: window.location.href,
            account_id: selectedAccount.id,
        });

        setLoadingSubmit(false);
        onSubmit(suggestion);
    }

    const accounts = useMemo(() => {
        if (searchedAccounts.length > 0) {
            return searchedAccounts;
        }

        return suggestedAccounts;
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm]);

    useEffect(() => {
        async function fetch() {
            setSuggestedAccounts(
                await searchSuggestionAccounts({}),
            );
            setHasLoadedSuggestedAccounts(true);
        }

        if (!hasLoadedSuggestedAccounts) {
            fetch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <p className="text-white/70">
                You can submit the currently playing video as a suggestion for any streamer.
            </p>
            <div className="mt-4">
                <input
                    autoFocus
                    type="text"
                    autoComplete="off"
                    placeholder="Search here..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.input}
                />

                <div className={classNames(
                    'flex flex-col h-64 py-2 overflow-y-auto',
                    accounts.length > 0 ? 'gap-1' : 'justify-center',
                )}
                >
                    {accounts.length === 0 && (
                        <div className="text-center text-gray-300">
                            {resultStatus === RESULTS_PENDING && ('Enter search term')}
                            {resultStatus === RESULTS_LOADING && ('Loading...')}
                            {resultStatus === RESULTS_EMPTY && ('No results')}
                        </div>
                    )}
                    {accounts?.map((account) => (
                        <div
                            key={account.id}
                            className={classNames(
                                account.id === selectedAccount?.id ? 'bg-primary-500/20' : 'hover:bg-white/10',
                                'py-2 px-3 rounded-md cursor-pointer transition-colors duration-100',
                            )}
                            onClick={() => setSelectedAccount(account)}
                        >
                            {account.display_name}
                        </div>
                    ))}
                </div>

                <Button
                    disabled={!canSubmit}
                    color="primary"
                    type="button"
                    className="w-full"
                    onClick={() => submit()}
                >
                    Submit
                </Button>
            </div>
        </div>
    );
}

SubmitSuggestionModal.propTypes = {
    onSubmit: PropTypes.func.isRequired,
};

SubmitSuggestionModal.defaultProps = {};

export default SubmitSuggestionModal;
