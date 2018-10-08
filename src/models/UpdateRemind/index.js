/**
 * Created by yiming on 2017/5/24.
 */
import React from 'react';
import UpdateRemind from './UpdateRemind.js';

const SwitchUpdateRemind = ({ match }) => {
    return (
        <UpdateRemind systemType={match.match.params.id} />
    );
};

export default SwitchUpdateRemind;
