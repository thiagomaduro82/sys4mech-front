import { Box, Button, Divider, Icon, Paper, Skeleton, Typography, useMediaQuery, useTheme } from "@mui/material";


interface IToolbarDetailProps {
    showBtnBack?: boolean;
    showBtnDelete?: boolean;
    showBtnNew?: boolean;
    showBtnSave?: boolean;
    showBtnSaveAndBack?: boolean;

    showBtnBackLoading?: boolean;
    showBtnDeleteLoading?: boolean;
    showBtnNewLoading?: boolean;
    showBtnSaveLoading?: boolean;
    showBtnSaveAndBackLoading?: boolean;

    onBtnBack?: () => void;
    onBtnDelete?: () => void;
    onBtnNew?: () => void;
    onBtnSave?: () => void;
    onBtnSaveAndBack?: () => void;
};

export const ToolbarDetail: React.FC<IToolbarDetailProps> = ({
    showBtnBack = true,
    showBtnDelete = true,
    showBtnNew = true,
    showBtnSave = true,
    showBtnSaveAndBack = true,

    showBtnBackLoading = false,
    showBtnDeleteLoading = false,
    showBtnNewLoading = false,
    showBtnSaveLoading = false,
    showBtnSaveAndBackLoading = false,

    onBtnBack,
    onBtnDelete,
    onBtnNew,
    onBtnSave,
    onBtnSaveAndBack
}) => {

    const theme = useTheme();
    const smDown = useMediaQuery(theme.breakpoints.down('sm'));
    const mdDown = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box component={Paper} height={theme.spacing(5)} display={'flex'} alignItems={'center'} gap={1} padding={1} margin={1}>
            {(showBtnSave && !showBtnSaveLoading) &&
                (<Button variant={'contained'} color={'primary'} disableElevation startIcon={<Icon>save</Icon>} onClick={onBtnSave} >
                    <Typography variant={'button'} textOverflow={'ellipsis'} whiteSpace={'nowrap'} overflow={'hidden'}>
                        Save
                    </Typography>
                </Button>)
            }
            {(showBtnSaveLoading) && (<Skeleton width={100} height={60}/>)}

            {(showBtnSaveAndBack && !showBtnSaveAndBackLoading && !smDown && !mdDown) &&
                (<Button variant={'outlined'} color={'primary'} disableElevation startIcon={<Icon>save</Icon>} onClick={onBtnSaveAndBack} >
                    <Typography variant={'button'} textOverflow={'ellipsis'} whiteSpace={'nowrap'} overflow={'hidden'}>
                        Save and Back
                    </Typography>
                </Button>)
            }
            {(showBtnSaveAndBackLoading && !smDown && !mdDown) && (<Skeleton width={150} height={60}/>)}

            {(showBtnNew && !showBtnNewLoading && !smDown) &&
                (<Button variant={'outlined'} color={'primary'} disableElevation startIcon={<Icon>add</Icon>} onClick={onBtnNew} >
                    <Typography variant={'button'} textOverflow={'ellipsis'} whiteSpace={'nowrap'} overflow={'hidden'}>
                        New
                    </Typography>
                </Button>)
            }
            {(showBtnNewLoading && !smDown) && (<Skeleton width={100} height={60}/>)}

            {(showBtnDelete && !showBtnDeleteLoading) &&
                (<Button variant={'outlined'} color={'error'} disableElevation startIcon={<Icon>delete</Icon>} onClick={onBtnDelete} >
                    <Typography variant={'button'} textOverflow={'ellipsis'} whiteSpace={'nowrap'} overflow={'hidden'}>
                        Delete
                    </Typography>
                </Button>)
            }
            {(showBtnDeleteLoading) && (<Skeleton width={100} height={60}/>)}

            {(showBtnBack && (showBtnSave || showBtnSaveAndBack || showBtnNew || showBtnDelete)) &&
                (<Divider orientation={'vertical'} variant={'middle'} />)
            }

            {(showBtnBack && !showBtnBackLoading) &&
                (<Button variant={'outlined'} color={'primary'} disableElevation startIcon={<Icon>arrow_back</Icon>} onClick={onBtnBack} >
                    <Typography variant={'button'} textOverflow={'ellipsis'} whiteSpace={'nowrap'} overflow={'hidden'}>
                        Back
                    </Typography>
                </Button>)
            }
            {(showBtnBackLoading) && (<Skeleton width={100} height={60}/>)}
        </Box>
    );
};