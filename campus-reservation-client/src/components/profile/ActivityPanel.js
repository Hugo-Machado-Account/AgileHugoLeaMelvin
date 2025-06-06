import React from 'react';
import {
  Box,
  Typography,
  Card,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  EventAvailable as EventAvailableIcon,
  EventBusy as EventBusyIcon,
  Person as PersonIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { ACTIVITY_TYPES } from '../../utils/profileConstants';
import { formatActivityDate, getActivityText } from '../../utils/profileUtils';

const ActivityPanel = ({ recentActivity }) => {
  // Obtenir l'icône pour l'activité récente
  const getActivityIcon = (activity) => {
    switch (activity.type) {
      case ACTIVITY_TYPES.RESERVATION_CREATED:
        return <EventAvailableIcon color="success" />;
      case ACTIVITY_TYPES.RESERVATION_CANCELLED:
        return <EventBusyIcon color="error" />;
      case ACTIVITY_TYPES.PROFILE_UPDATED:
        return <PersonIcon color="primary" />;
      default:
        return <HistoryIcon />;
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Activité récente
      </Typography>

      <Card>
        <List>
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemIcon>
                    {getActivityIcon(activity)}
                  </ListItemIcon>
                  <ListItemText
                    primary={getActivityText(activity)}
                    secondary={formatActivityDate(activity.date)}
                  />
                </ListItem>
                {index < recentActivity.length - 1 && <Divider />}
              </React.Fragment>
            ))
          ) : (
            <ListItem>
              <ListItemText
                primary="Aucune activité récente"
                secondary="Vos activités récentes apparaîtront ici"
              />
            </ListItem>
          )}
        </List>
      </Card>
    </Box>
  );
};

export default ActivityPanel; 