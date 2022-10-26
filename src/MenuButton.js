import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import {Button, IconButton} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const options = [
    'Удалить',
    'Отправить эксперту',
];

export default function BasicMenu(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleDelete = () => {
        var storedNames = JSON.parse(localStorage.getItem("names")).reverse()
        storedNames = storedNames.filter(function(value, index, arr){
            return value !== props.props.toString();
        });
        localStorage.setItem("names", JSON.stringify(storedNames));
        props.set(props.rows.filter(function(value, index, arr){
            return value.id !== props.props;
        }))
    };

    return (
        <div>
            <IconButton
                size={'small'}
                style={{ marginLeft: 16}}
                onClick={handleClick}
            >
                <MoreVertIcon></MoreVertIcon>
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleDelete}>Удалить</MenuItem>
                <MenuItem onClick={handleClose}>Отправить эксперту</MenuItem>
            </Menu>
        </div>
    );
}
