import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { searchSuggestionAccounts, submitSuggestion } from '~/common/bridge';

function SubmitSuggestionModal({ onSubmit }) {
    const [hasLoadedSuggestedAccounts, setHasLoadedSuggestedAccounts] = useState(false);
    const [suggestedAccounts, setSuggestedAccounts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchedAccounts, setSearchedAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [loading, setLoading] = useState(false);

    const canSubmit = useMemo(() => !loading && !!selectedAccount?.id, [selectedAccount, loading]);

    async function searchAccounts() {
        setSearchedAccounts(
            await searchSuggestionAccounts({ query: searchTerm }),
        );
    }

    async function submit() {
        setLoading(true);

        const suggestion = await submitSuggestion({
            video_url: window.location.href,
            user_account_id: selectedAccount.id,
        });

        setLoading(false);
        onSubmit(suggestion);
    }

    const accounts = useMemo(() => {
        if (searchedAccounts.length > 0) {
            return searchedAccounts;
        }

        return suggestedAccounts;
    }, [suggestedAccounts, searchedAccounts]);

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
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-[99999] flex items-center justify-center">

            <div className="bg-white rounded-lg p-8">
                <input
                    autoFocus
                    type="text"
                    autoComplete="off"
                    className="border"
                    placeholder="Search here..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {accounts?.map((account) => (
                    <div
                        key={account.id}
                        className={classNames(account.id === selectedAccount?.id && 'text-green-500')}
                        onClick={() => setSelectedAccount(account)}
                    >
                        {account.display_name}
                    </div>
                ))}

                <button
                    disabled={!canSubmit}
                    className="block bg-primary-500 disabled:opacity-50"
                    type="button"
                    onClick={submit}
                >
                    Submit
                </button>
            </div>
        </div>
    );
}

SubmitSuggestionModal.propTypes = {
    onSubmit: PropTypes.func.isRequired,
};

SubmitSuggestionModal.defaultProps = {};

export default SubmitSuggestionModal;
